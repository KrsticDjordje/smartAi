import Vue from 'vue'
import VueRouter from 'vue-router'
import HomeView from '../views/HomeView.vue'

Vue.use(VueRouter)

const routes = [
  {
    path: '/',
    name: 'home',
    component: HomeView
  },
  {
    path: '/about',
    name: 'about',
    // route level code-splitting
    // this generates a separate chunk (about.[hash].js) for this route
    // which is lazy-loaded when the route is visited.
    component: () => import(/* webpackChunkName: "about" */ '../views/AboutView.vue')
  },
  {
    path: '/audioRecording',
    name: 'audioRecording',
    component: () => import(/* webpackChunkName: "about" */ '../views/AudioRecording.vue')
  },
  {
    path: '/screenRecording',
    name: 'screenRecording',
    component: () => import(/* webpackChunkName: "about" */ '../views/ScreenRecordingView.vue')
  },
  {
    path: '/myUploads',
    name: 'myUploads',
    component: () => import(/* webpackChunkName: "about" */ '../views/MyUploadsView.vue')
  },
  {
    path: '/screenRecordings',
    name: 'screenRecordings',
    component: () => import(/* webpackChunkName: "about" */ '../views/ScreenRecordings.vue')
  },
  {
    path: '/myTranslations',
    name: 'myTranslations',
    component: () => import(/* webpackChunkName: "about" */ '../views/MyTranslationsView.vue')
  },
  {
    path: '/groupTranscriptions',
    name: 'groupTranscriptions',
    component: () => import(/* webpackChunkName: "about" */ '../views/GroupTranscriptionsView.vue')
  },
  {
    path: '/adminPanel',
    name: 'adminPanel',
    component: () => import(/* webpackChunkName: "about" */ '../views/AdminPanel.vue')
  },
  {
    path: '/folderTranscriptions/:id/:name',
    name: 'folderTranscriptions',
    component: () => import(/* webpackChunkName: "about" */ '../views/FolderTranscriptions.vue')
  },
  {
    path: '/oneTranscription/:id/:name',
    name: 'oneTranscription',
    component: () => import(/* webpackChunkName: "about" */ '../views/GetOneTranscription.vue')
  },
  {
    path: '/audioRecordings',
    name: 'audioRecordings',
    component: () => import(/* webpackChunkName: "about" */ '../views/AudioRecordings.vue')
  },
  {
    path: '/subtitles',
    name: 'subtitles',
    component: () => import(/* webpackChunkName: "about" */ '../views/Subtitles.vue')
  },
  {
    path: '/translateText',
    name: 'translateText',
    component: () => import(/* webpackChunkName: "about" */ '../views/TranslateText.vue')
  },
  {
    path: '/login',
    name: 'login',
    component: () => import(/* webpackChunkName: "about" */ '../views/LoginView.vue')
  }
]

const router = new VueRouter({
  mode: 'history',
  base: process.env.BASE_URL,
  routes
})

export default router
