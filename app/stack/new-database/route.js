import Ember from 'ember';

export default Ember.Route.extend({
  model: function(){
    var stack = this.modelFor('stack');
    return this.store.createRecord('database', {
      stack: stack
    });
  },

  actions: {
    create: function(){
      var db = this.currentModel;
      var route = this;
      db.save({ stack: {id: db.get('stack.id')} }).then(function(){
        route.transitionTo('databases.index');
      });
    }
  }
});
