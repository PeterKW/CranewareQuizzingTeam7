<template>
    <body id="gradient">
    <div class="container-fluid">
      <h1 class="display-1 col-md-12 text-responsive">Cranehoot</h1>

      <div class="d-flex justify-content-center" style="height: 100px">
        <!-- Input and buttons need to be replaced with vue components -->
        <form class="main-form col-10 col-sm-8 col-md-6 col-lg-4 col-xl-2">
          <div class="form-group">
            <input
              type="text"
              class="form-control form-control-lg"
              placeholder="USERNAME"
              maxlength="10"
            />
          </div>
          <div class="form-group">
            <input
              type="text"
              class="form-control form-control-lg"
              placeholder="GAME PIN"
              maxlength="8"
            />
          </div>
          <button type="button" class="btn btn-primary btn-block">
            Singleplayer
          </button>
          <button type="button" class="btn btn-primary btn-block">
            Join Lobby
          </button>
          <button type="button" class="btn btn-primary btn-block">
            Create Lobby
          </button>
        </form>
      </div>
    </div>
  </body>
</template>

<script>
export default {
  name: 'Index'
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>

</style>
