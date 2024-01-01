<template>
  <q-layout class="bg" view="hHh lpR fFf">
    <nav class="bg-primary q-py-sm text-white navbar" height-hint="98">
      <div class="container">
        <q-toolbar>
          <div class="col-5 settings-box row justify-start items-center">
            <div class="settings-box__lang row justify-center q-pt-xs">
              <img
                class="settings-box__lang--icon"
                src="/public/images/lang-chang-icon.png"
              />
              <span>
                AR/EN <img src="/public/images/langchangeVector.png" />
              </span>
            </div>
            <div class="settings-box__time offset-1">
              <p class="">
                {{
                  currentTime.toLocaleTimeString([], {
                    hour: "2-digit",
                    minute: "2-digit",
                  })
                }}
              </p>
            </div>
          </div>

          <q-tabs class="col-4 nav-buttons" align="center">
            <div class="nav-buttons__btn">
              <q-route-tab class="nav-buttons__btn--route" to="/page1">
                <img src="/public/images/department.png" />
              </q-route-tab>
              <span>Department</span>
            </div>
            <div class="nav-buttons__btn">
              <q-route-tab class="nav-buttons__btn--route" to="/page1">
                <img src="/public/images/meeting.png" />
              </q-route-tab>
              <span>Meeting Room</span>
            </div>
            <div class="nav-buttons__btn">
              <q-route-tab class="nav-buttons__btn--route" to="/page1">
                <img src="/public/images/facilty.png" />
              </q-route-tab>
              <span>Facility</span>
            </div>
            <!-- <q-route-tab to="/page2" label="Page Two" />
            <q-route-tab to="/page3" label="Page Three" /> -->
          </q-tabs>
          <div class="logo col-3">
            <img src="/public/images/Logo-header.png" />
          </div>
        </q-toolbar>
      </div>
    </nav>
    <div class="header-nav row">
      <div
        class="col-6 q-py-xs row justify-end items-center bg-secondary header-nav__floors"
      >
        <div class="col-3 header-nav__floors--text q-pl-lg">
          <h5>FLOOR <span> GUIDE</span></h5>
        </div>
        <div
          class="col-6 q-pl-md header-nav__floors--rooms row justify-between items-center"
        >
          <div
            class="header-nav__floors--rooms--item row justify-center items-center"
          >
            G
          </div>
          <div
            class="header-nav__floors--rooms--item row justify-center items-center"
          >
            F1
          </div>
          <div
            class="header-nav__floors--rooms--item row justify-center items-center"
          >
            F2
          </div>
          <div
            class="header-nav__floors--rooms--item row justify-center items-center"
          >
            F3
          </div>
          <div
            class="header-nav__floors--rooms--item row justify-center items-center"
          >
            F4
          </div>
        </div>
        <div
          class="col-2 header-nav__floors--btn row items-center justify-center"
        >
          <p>close</p>
          <img class="q-pl-sm" src="/public/images/up-Vector.png" />
        </div>
      </div>
      <div class="col-6 row justify-center items-center">
        <div class="search">
          <q-input
            bg-color="white"
            placeholder="WHERE DO YOU WANT TO GO?"
            rounded
            outlined
            v-model="text"
          >
            <template v-slot:prepend>
              <q-avatar>
                <img class="icon-dash" src="/public/images/search-icon.png" />
              </q-avatar>
              <span class="dash"></span>
            </template>
          </q-input>
        </div>
      </div>
    </div>

    <!-- <q-page-container>
      <router-view />
      iframe
    </q-page-container> -->
  </q-layout>
</template>

<script setup>
import { useCurrentTime } from "../composables/useCurrentTime";
const { currentTime } = useCurrentTime();
</script>

<style lang="scss" scoped>
@font-face {
  font-family: digital;
  src: url(../fonts/DS-DIGIT.TTF);
}
.bg {
  background: #dbdbe4;
}
.container {
  width: 90%;
  margin: 0 auto;
}
.logo {
  /* background-color: aqua; */

  width: 303px;
  height: 99px;
}
.settings-box {
  &__lang {
    background-color: $secondary;
    width: 60px;
    height: 55px;
    border-radius: 18px;
    border: solid 2px $secondary;
    cursor: pointer;
    &--icon {
      width: 30px;
      height: 30px;
    }

    span {
      font-size: 10px;
      font-weight: 500;
      vertical-align: super;
      display: inline-block;

      img {
        display: inline-block;
      }
    }
  }
  &__time {
    font-size: 40px;

    font-family: "digital";
    color: $text-color;
  }
}
.nav-buttons {
  .q-tabs__content.q-tabs__content--align-justify {
    justify-content: center !important;
  }
  &__btn {
    text-align: center;
    padding: 5px;
    a.q-tab--inactive {
      opacity: 1;
    }

    &--route {
      background-color: $secondary;
      width: 70px;
      height: 70px;
      border-radius: 18px;
      border: solid 2px $secondary;
      padding: 0;
      margin: auto;

      &:hover,
      .avtive {
        background-color: $primary;
        border: solid 2px $text-color;
      }
    }
    span {
      font-size: 14px;
      font-weight: 400;
      display: inline-block;
      // width: 99%;
    }
  }
}
.header-nav {
  // height: 130px;

  &__floors {
    border-bottom-right-radius: 22px;

    &--text {
      h5 {
        font-weight: 500;
        font-size: 36px;
        line-height: 34px;
        margin: 5px;
        padding-block: 10px;
        color: $text-color;
        border-right: solid 2px $text-color;
        span {
          color: $primary;
        }
      }
    }
    &--rooms {
      &--item {
        width: 70px;
        height: 70px;
        border-radius: 18px;
        background-color: $text-color;
        border: solid 2px $text-color;
        font-size: 40px;
        font-weight: 400;
        color: $primary;
        cursor: pointer;
        &:hover,
        .active {
          background-color: $primary;
          color: $text-color;
        }
      }
    }
    &--btn {
      // background: chocolate;
      p {
        font-size: 15px;
        font-weight: 400;
        color: $text-color;
        margin: 0;
        padding: 0 10px;
        border-right: solid 2px $text-color;
      }
    }
  }
  .search {
    width: 70%;
    margin: auto;
    .dash {
      width: 25px;
      height: 1px;
      background: #b5b5b5;
      rotate: 90deg;
    }

    .q-field--outlined {
      .q-field__control:before {
        border: none !important;
      }
      .q-field__control:hover:before {
        border: none !important;
      }
    }
  }
}
</style>
