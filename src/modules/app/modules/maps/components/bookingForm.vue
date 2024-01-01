<template>
  <q-card>
    <q-card-section class="row">
      <div>
        <q-tabs v-model="selectModel">
          <q-tab name="for me" label="for me" />
          <q-tab name="for someone else" label="for someone else"
        /></q-tabs>
      </div>
    </q-card-section>
    <q-form @submit="submit">
      <q-card-section class="row">
        <q-input
          :rules="[rules, specialCharRules]"
          v-model="name"
          filled
          label="fullname"
          :dense="dense"
          :readonly="selectModel == 'for me'"
          class="col-4 q-mr-lg"
        />
        <q-input
          :rules="[rules, specialCharRules]"
          v-model="email"
          filled
          label="E-mail adress"
          :dense="dense"
          class="col-4"
          v-if="selectModel == 'for someone else'"
        />
      </q-card-section>
      <q-card-section class="row">
        <q-input
          v-model="deskId"
          filled
          label="desk ID"
          :dense="dense"
          class="col-4 q-mr-lg"
          readonly
        />
        <q-input
          v-model="deviceId"
          filled
          label="device ID"
          :dense="dense"
          class="col-4"
          autofocus
          autogrow
          readonly
        />
      </q-card-section>
      <q-card-section class="row">
        <div class="col-6 row">
          <q-input
            label="start date"
            filled
            v-model="startDate"
            mask="date"
            class="col-5 q-mr-lg"
            :rules="[rules, specialCharRules]"
          >
            <template v-slot:append>
              <q-icon name="event" class="cursor-pointer">
                <q-popup-proxy
                  cover
                  transition-show="scale"
                  transition-hide="scale"
                >
                  <q-date v-model="startDate" :options="optionsSD">
                    <div class="row items-center justify-end">
                      <q-btn v-close-popup label="Close" color="primary" flat />
                    </div>
                  </q-date>
                </q-popup-proxy>
              </q-icon>
            </template>
          </q-input>
          <q-input
            :rules="[rules, specialCharRules]"
            filled
            v-model="startTime"
            label="start time"
            class="col-5"
          >
            <template v-slot:append>
              <q-icon name="access_time" class="cursor-pointer">
                <q-popup-proxy
                  cover
                  transition-show="scale"
                  transition-hide="scale"
                >
                  <q-time v-model="startTime" mask=" hh:mm A">
                    <div class="row items-center justify-end">
                      <q-btn v-close-popup label="Close" color="primary" flat />
                    </div>
                  </q-time>
                </q-popup-proxy>
              </q-icon>
            </template>
          </q-input>
        </div>
        <div class="col-5 row">
          <q-input
            :rules="[rules, specialCharRules]"
            label="end date"
            filled
            v-model="endDate"
            mask="date"
            class="col-5 q-mr-lg"
          >
            <template v-slot:append>
              <q-icon name="event" class="cursor-pointer">
                <q-popup-proxy
                  cover
                  transition-show="scale"
                  transition-hide="scale"
                >
                  <q-date v-model="endDate" :options="optionsED">
                    <div class="row items-center justify-end">
                      <q-btn v-close-popup label="Close" color="primary" flat />
                    </div>
                  </q-date>
                </q-popup-proxy>
              </q-icon>
            </template>
          </q-input>
          <q-input
            filled
            v-model="endTime"
            label="end time"
            class="col-5"
            :rules="[rules, specialCharRules]"
          >
            <template v-slot:append>
              <q-icon name="access_time" class="cursor-pointer">
                <q-popup-proxy
                  cover
                  transition-show="scale"
                  transition-hide="scale"
                >
                  <q-time
                    v-model="endTime"
                    mask=" HH:mm A"
                    :options="optionsET"
                  >
                    <div class="row items-center justify-end">
                      <q-btn v-close-popup label="Close" color="primary" flat />
                    </div>
                  </q-time>
                </q-popup-proxy>
              </q-icon>
            </template>
          </q-input>
          <div class="col">
            <q-btn
              square
              :color="available"
              glossy
              text-color="black"
              class="q-ml-lg col q-ma-sm"
              icon="refresh"
              :disable="availabilityBtn"
              @click="checkAvailability"
            />
          </div>
        </div>
      </q-card-section>
      <q-card-section class="row justify-center">
        <q-btn flat style="color: #ff0000" label="Cancel" class="q-mx-lg" />
        <q-btn color="primary" label="Save" type="submit" />
      </q-card-section>
    </q-form>
  </q-card>
</template>

<script setup>
import { computed, reactive, ref } from "vue";
import storage from "src/services/storage";
import { useMapStore } from "../store/index";

const emit = defineEmits(["booking-submit"]);
const props = defineProps({
  deskObj: {
    type: Object,
  },
});

const store = useMapStore();

const { bookDesk, checkDeskAvailability } = store;

const options = ref(["for me", "for someone else"]);
const selectModel = ref("for me");
const profile = storage.getProfile();
const name = ref(profile.fullName);
const email = ref(profile.email);
const rules = (val) => (val && val.length > 0) || "Please type something";
const regex = /^[0-9a-zA-Z\u0600-\u06FF _ , _ / :@.]+$/;
const specialCharRules = (val) =>
  val.match(regex) || "please dont write any special charachters ";

const deskId = ref(props.deskObj ? props.deskObj.deskId : null);
const deviceId = ref(props.deskObj ? props.deskObj.deviceId : null);

var today = new Date();
var dd = ref(String(today.getDate()).padStart(2, "0"));
var mm = ref(String(today.getMonth() + 1).padStart(2, "0"));
var yyyy = ref(today.getFullYear());

const startDate = ref(`${yyyy.value}/${mm.value}/${dd.value}`);
const endDate = ref("");

const startTime = ref("");
const endTime = ref("");

const available = ref("warning");

const form = reactive({
  name: name.value,
  email: email.value,
  deskId: deskId.value,
  deviceId: deviceId.value,
  startDate: startDate.value,
  startTime: startTime.value,
  endDate: endDate.value,
  endTime: endTime.value,
});

const availabilityBtn = computed(() =>
  startDate.value && startTime.value && endDate.value && endTime.value
    ? false
    : true
);

function submit() {
  const data = {
    deskId: form.deskId,
    deviceId: form.deviceId,
    profileId: profile.email,
    SD: new Date(`${form.startDate} ${form.startTime}`).toISOString(),
    ED: new Date(`${endDate.value} ${form.endTime}`).toISOString(),
  };

  bookDesk(data);
}

// if (availabilityBtn.value) {
//   checkAvailability();
// }

function checkAvailability() {
  const data = {
    deskId: form.deskId,
    SD: new Date(`${form.startDate} ${form.startTime}`).toISOString(),
    ED: new Date(`${endDate.value} ${form.endTime}`).toISOString(),
  };

  checkDeskAvailability(data)
    .then((res) => {
      available.value =
        res.data.data.isAvalibile === true ? "positive" : "negative";
    })
    .catch((available.value = "negative"));
}

function optionsSD(date) {
  return date >= `${yyyy.value}/${mm.value}/${dd.value}`;
}
function optionsED(date) {
  return date >= startDate.value;
}

function optionsET(hr) {
  let date = new Date(startDate.value + startTime.value);
  if (startDate.value === endDate.value) {
    return hr >= date.getHours();
  } else {
    return true;
  }
}
</script>

<style></style>
