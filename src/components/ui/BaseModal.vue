<script setup>
const props = defineProps(['title', 'id']);
const emits = defineEmits(['close']);

// const dialog = document.getElementById(props.id);

// document.addEventListener('keydown', (e) => {
//   if (e.key === 'Escape') {
//     e.preventDefault(); // Prevent default behavior (closing the dialog)

//     // Perform custom action instead
//     if (dialog.open) {
//       emits('close');
//     }
//   }
// });
</script>

<template>
  <teleport to='body'>
    <dialog :id='props.id' :class="['modal']">
        <div :class="['modal-box']">
          <div :class="['modal-action']">
            <header>
              <slot name='header'>
                <h2>{{ title }}</h2>
              </slot>
            </header>
            <section>
              <slot :class="['vertical-scroll']" name='body'> </slot>
            </section>
            <menu>
              <!-- <form method="dialog"> -->
                <slot name='actions'>
                  <base-button @click="emits('close')">Close</base-button>
                </slot>
              <!-- </form> -->
            </menu>
          </div>
        </div>
    </dialog>
  </teleport>
</template>
