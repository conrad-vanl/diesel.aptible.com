import Ember from 'ember';

export default Ember.Route.extend({
  titleToken: function(){
    var app = this.modelFor('app');
    return `Add a domain - ${app.get('handle')}`;
  },
  model: function(){
    var app = this.modelFor('app');

    return Ember.RSVP.hash({
      vhost: this.store.createRecord('vhost'),
      services: app.get('services')
    });
  },

  setupController: function(controller, model){
    var vhost = model.vhost,
        services = model.services;

    controller.set('model', vhost);
    controller.set('services', services);
    controller.set('vhostService', services.objectAt(0));
  },

  actions: {
    willTransition: function(){
      this.currentModel.rollback();
    },

    save: function(vhost, service){
      vhost.set('service', service);

      vhost.save().then( () => {
        let op = this.store.createRecord('operation', {
          type: 'provision',
          vhost: vhost
        });
        return op.save();
      }).then( () => {
        this.transitionTo('app.vhosts');
      });
    },

    cancel: function(){
      this.transitionTo('app.vhosts');
    }
  }
});
