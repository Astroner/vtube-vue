<template>
    <div
        ref="elRef"
        :class="{
            'video': true,
            'video--active': active,
            'video--default': !active,
        }"
    >
        <div class="video__content" >
            <display-image
                :display="display"
                width="25%"
                height="calc(100% - 15px)"
                margin="7px 10px 0px 5px"
                @click.self="!disableMenu && openMenu()"
            />
            {{ title }}
        </div>
        <div 
            @click="e => e.stopPropagation()"
            :class="{
                video__menu: true,
                'video__menu--open': menuState,
                'video__menu--closed': !menuState,
            }"
        >
            <slot>
                <Button @click="play">
                    Play
                </Button>
                <Button 
                    style="margin-left: 5px;" 
                    @click="save" :disabled="isDownloaded || isDownloading"
                >
                    {{ isDownloading ? "Saving..." : isDownloaded ? "Saved" : "Save"}}
                </Button>
            </slot>
        </div>
    </div>
</template>

<script lang="ts">
import {
 PropType, toRef, Ref, ref, SetupContext, watchEffect, computed, 
} from "vue";
import { YTImage } from "@/Responses";
import { useSaved } from "@/music-storage/use-saved";
import { musicStorage } from "@/music-storage";
import { useIsDownloading } from "@/helpers/hooks/use-is-downloading";

import DisplayImage from './DisplayImage.vue';
import Button from './Button.vue';

export default {
    components: { DisplayImage, Button },
    props: {
        display: {
            type: Array as PropType<YTImage[]>,
            required: true,
        },
        code: {
            type: String,
            required: true,
        },
        title: {
            type: String,
            required: true,
        },
        active: Boolean,
        disableMenu: Boolean,
    },
    setup(props: any, { emit }: SetupContext) {
        const code: Ref<string> = toRef(props, 'code');

        const menuState = ref(false);

        const isDownloading = useIsDownloading(code);

        const elRef = ref<HTMLDivElement | null>(null);
        
        const saved = useSaved();
        
        const isDownloaded = computed(() => saved.value?.find((item) => item.code === code.value));

        watchEffect((onCleanup) => {
            if (!elRef.value) return;
            const el = elRef.value;
            const handler = (e: MouseEvent) => {
                if (!el.contains(e.target as any)) {
                    if (menuState.value) {
                        menuState.value = false;
                    }
                }
            };

            document.addEventListener('click', handler);
            onCleanup(() => {
                document.removeEventListener('click', handler);
            });
        });

        return {
            menuState,
            elRef,
            isDownloaded,
            isDownloading,
            openMenu() {
                menuState.value = !menuState.value;
            },
            play(e: Event) {
                emit('click', e);
                menuState.value = false;
            },
            async save() {
                musicStorage.saveToOthers(code.value);
            },
        };
    },
};
</script>

<style lang="scss" scoped>
.video {
    border: 1px solid black;

    font-size: 20px;
    line-height: 24px;

    width: 100%;

    transition: color .5s, background-color .5s;

    &--active {
        background-color: black;

        color: white;
    }

    &--default {
        background-color: white;

        color: black;
    }

    &:not(:last-child) {
      margin-bottom: 5px;
    }

    &__content {
        height: 72px;

        display: flex;
    }

    &__menu {
        display: flex;

        transition: height .3s, padding .3s;

        overflow: hidden;

        &--open {
            height: 45px;
            padding: 5px;
        }

        &--closed {
            height: 0;
            padding: 0 5px;
        }
    }
}
</style>
