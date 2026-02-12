import type { RouteRecordRaw } from 'vue-router';

const routes: RouteRecordRaw[] = [
  {
    path: '/',
    component: () => import('layouts/MainLayout.vue'),
    children: [
      { path: '', component: () => import('pages/IndexPage.vue') },
      {
        path: 'tasks',
        component: () => import('pages/TaskListPage.vue'),
      },
      {
        path: 'tasks/:id/edit',
        component: () => import('pages/TaskEditPage.vue'),
      },
      {
        path: 'schedule',
        component: () => import('pages/SchedulePage.vue'),
      },
    ],
  },

  // Always leave this as last one,
  // but you can also remove it
  {
    path: '/:catchAll(.*)*',
    component: () => import('pages/ErrorNotFound.vue'),
  },
];

export default routes;
