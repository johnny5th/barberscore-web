import Ember from 'ember';
import Model from 'ember-data/model';
import DS from 'ember-data';
import {memberAction} from 'ember-api-actions';
import { validator, buildValidations } from 'ember-cp-validations';

const Validations = buildValidations({
  name: validator('presence', true),
  });

export default Model.extend(Validations, {
  nomen: DS.attr('string'),
  name: DS.attr('string'),
  status: DS.attr('convention-status'),
  season: DS.attr('convention-season'),
  panel: DS.attr('convention-panel'),
  year: DS.attr('number', {defaultValue: 2017}),
  openDate: DS.attr('isodate'),
  closeDate: DS.attr('isodate'),
  startDate: DS.attr('isodate'),
  endDate: DS.attr('isodate'),
  location: DS.attr('string', {defaultValue: ''}),
  venue: DS.belongsTo('venue', {async: true}),
  entity: DS.belongsTo('entity', {async: true}),
  assignments: DS.hasMany('assignment', {async: true}),
  sessions: DS.hasMany('session', {async: true}),
  permissions: DS.attr(),

  schedule: memberAction({path: 'schedule', type: 'post'}),
  open: memberAction({path: 'open', type: 'post'}),

  isPublished: Ember.computed.equal('status', 'Published'),
  isActive: Ember.computed.not('isPublished'),

  statusOptions: [
    'New',
    'Listed',
    'Opened',
    'Closed',
    'Validated',
    'Started',
    'Finished',
    'Published',
  ],

  kindOptions: [
    'International',
    'District',
    'Division',
    'District and Division',
  ],

  levelOptions: [
    'International',
    'District',
    'Division',
    'Chapter',
  ],

  seasonOptions: [
    'Summer',
    'Midwinter',
    'Fall',
    'Spring',
    'Video',
  ],

  panelOptions: [
    'Single',
    'Double',
    'Triple',
    'Quadruple',
    'Quintiple',
  ],

  yearOptions: [
    2017,2018
  ],
  riserOptions: [
    0,3,4,5,6,7,8,9,10,11,12,13
  ],

});
