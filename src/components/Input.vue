<template>
    <div>
        <div class="input__title" v-if="title">
          {{ title }}
        </div> 
        <div class="input__container">
            <!-- <div class="input__hide" v-if="password && value">
                {{ new Array(value.length).fill("-").join("") }}
            </div> -->
            <input 
                :class="{
                    'input': true,
                    'input--active': state || !value,
                    'input--default': !state,
                }"
                :value="value"
                @input="update"
                contenteditable 
                spellcheck="false" 
                autocapitalize="none"
                @focus="state = true"
                @blur="state = false"
                :type="password ? 'password' : 'text'"
            />
        </div>
      </div>
</template>

<script lang="ts">
import { ref, SetupContext } from 'vue';

export default {
    props: {
        title: String,
        value: String,
        password: Boolean,
    },
    setup(_: unknown, ctx: SetupContext) {
        const state = ref<boolean>(false);

        return {
            state,
            update(e: Event) {
                ctx.emit("update:value", (e.target as HTMLInputElement).value);
            },
        };
    },
};
</script>

<style lang="scss" scoped>
.input {
    width: 100%;

    padding: 5px;

    font-size: 26px;
    line-height: 30px;

    outline: none;

    transition: border .3s, box-shadow .3s;
    
    text-align: center;

    &--default {
        border: 1px solid transparent;
    }

    &--active {
        border: 1px solid black;

        box-shadow: 0 0 10px rgba($color: #000000, $alpha: .3);
    }

    &__title {
        font-size: 22px;

        margin-bottom: 2px;
    }
    &__container {
        position: relative;

        border: 1px dashed black;

        padding: 5px;
    }
    &__hide {
        position: absolute;
        top: 6px;
        left: 6px;
        bottom: 6px;
        right: 6px;

        background-color: #fff;

        pointer-events: none;

        display: flex;
        align-items: center;
        justify-content: center;

        font-size: 26px;
        line-height: 30px;
    }
}
</style>
