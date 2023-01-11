<template>
  <button>
    <slot></slot>
  </button>
</template>

<style lang="scss" scoped>
button {
    width: 100%;

    border: 1px solid #000;

    background-color: #fff;

    font-size: 26px;
    line-height: 30px;

    transition: background-color .3s, color .3s;

    &:active {
        background-color: #000;
        color: #fff;
    }
}
</style>
