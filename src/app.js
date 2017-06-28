import document from 'global/document';
import dva from '#/dva';
import models from '#/extModels';
import sagas from '#/sagas';
import routes from '#/extRoutes';

const app = dva();

models.forEach(model => app.model(model));

app.router(routes);

app.start(document.querySelector('#root'), {
  sagas
});

export const store = app.store;

if (process.env.NODE_ENV === 'development') {
  window.store = store;
  window.__debug_mode = true;
}
