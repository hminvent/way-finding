<template>
  <div class="keyboard-container q-mt-xl">
    <q-input v-model="input" filled dense @focus="showKeyboard = true" />

    <div class="keyboard-keys row wrap" v-if="showKeyboard">
      <div
        class="keyboard-key flex col-xs-12 q-my-xs"
        v-for="(row, index) in getKeyboardLayout()"
        :key="index"
      >
        <q-btn
          v-if="index === 0"
          size="md"
          dense
          color="secondary"
          class="keyboard-key__button q-px-md q-mx-xs"
          @click="deleteCharacter"
        >
          &#9003; Delete
        </q-btn>
        <q-btn
          v-if="index === 1"
          size="md"
          dense
          color="primary"
          class="keyboard-key__button q-px-md q-mx-xs"
          @click="handleEnter"
        >
          Enter
        </q-btn>
        <q-btn
          v-if="index === 2"
          size="md"
          dense
          color="secondary"
          class="keyboard-key__button q-px-md q-mx-xs"
          @click="toggleShift"
        >
          {{ shiftEnabled ? "⇩" : "⇧" }} Shift
        </q-btn>
        <q-btn
          v-if="index === 3"
          size="md"
          dense
          color="secondary"
          class="keyboard-key__button q-px-md q-mx-xs"
          @click="toggleLanguage"
        >
          {{ language === "english" ? "AR" : "EN" }}
        </q-btn>

        <q-btn
          v-for="key in row"
          :key="key"
          size="md"
          dense
          dir="ltr"
          color="black"
          :class="`keyboard-key__button q-px-md q-mx-xs
             ${
               shiftEnabled && language === 'english'
                 ? 'text-uppercase'
                 : 'text-lowercase'
             }
          `"
          :style="{ width: key === 'space' ? '30%' : 'auto' }"
          @click="handleKeyPress(key === 'space' ? ' ' : key)"
        >
          {{
            key === "space"
              ? "Space"
              : shiftEnabled
              ? language === "english"
                ? key.toUpperCase()
                : arabicToUnicode(key.toUpperCase())
              : language === "english"
              ? key.toLowerCase()
              : arabicToUnicode(key.toLowerCase())
          }}
        </q-btn>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref } from "vue";

const input = ref("");
const showKeyboard = ref(false);
const keyboardLayout = [
  ["1", "2", "3", "4", "5", "6", "7", "8", "9", "0"],
  ["p", "o", "i", "u", "y", "t", "r", "e", "w", "q"],
  ["l", "k", "j", "h", "g", "f", "d", "s", "a"],
  ["m", "n", "b", "v", "c", "x", "z"],
  ["space"],
];
const arabicKeyboardLayout = [
  ["1", "2", "3", "4", "5", "6", "7", "8", "9", "0"],
  ["ح", "خ", "ه", "ع", "غ", "ف", "ق", "ث", "ص", "ض"],
  ["ك", "م", "ن", "ت", "ا", "ل", "ب", "ي", "س", "ش"],
  ["ى", "ة", "و", "ر", "ز", "د", "ذ", "ط", "ظ"],
  ["أ", "ر", "ى", "ز", "و", "ئ", "ط", "ء"],
  ["space"],
];
const language = ref("english");
const shiftEnabled = ref(false);

const handleKeyPress = (key) => {
  if (key === " ") {
    input.value += " ";
  } else if (key === ".") {
    input.value += ".";
  } else {
    input.value +=
      shiftEnabled.value && key === key.toLowerCase() ? key.toUpperCase() : key;
  }
};

const deleteCharacter = () => {
  const length = input.value.length;
  if (length > 0) {
    input.value = input.value.slice(0, length - 1);
  }
};

const handleEnter = () => {
  // Call a function or log the value typed
  console.log("Entered value:", input.value);
};

const toggleShift = () => {
  shiftEnabled.value = !shiftEnabled.value;
};

const toggleLanguage = () => {
  language.value = language.value === "english" ? "arabic" : "english";
};

const arabicToUnicode = (str) => {
  return str.replace(/.\u061C/g, function (c) {
    var decoded = "";
    for (var i = 1; i < c.length; ++i) {
      decoded += String.fromCodePoint(c.codePointAt(i) + 0xfee0);
    }
    return decoded;
  });
};

const getKeyboardLayout = () => {
  return language.value === "arabic" ? arabicKeyboardLayout : keyboardLayout;
};
</script>

<style scoped>
.keyboard-container {
  .keyboard-keys {
    display: flex;
    flex-wrap: wrap;
  }

  .keyboard-key {
    display: flex;
    align-items: center;
    justify-content: center;

    font-size: 14px;
    cursor: pointer;

    &__button {
      width: 100%;
      height: 100%;
      background-color: grey;
      border: 1px solid black;
    }

    &.uppercase {
      text-transform: uppercase;
    }

    &.rtl {
      direction: rtl;
    }
  }
}
</style>
