<template>
  <div>
    <ScreenRecording class="none" />
    <div class="desktop-version mt-15">
      <p>
        You need to switch to desktop, this feature is not available on the
        mobile version.
      </p>
      <img
        class="img-fluid"
        src="https://cdni.iconscout.com/illustration/premium/thumb/sorry-we-are-closed-4004036-3310009.png"
      />
    </div>
  </div>
</template>
<script>
import ScreenRecording from "@/components/ScreenRecording.vue";
export default {
  components: {
    ScreenRecording,
  },
};
</script>