import { Event, getEvent } from './Event';
import EventDispatcher, { createEventDispatcher } from './EventDispatcher';
import { isObject } from './utils';

export default EventDispatcher;
export { Event, EventDispatcher, createEventDispatcher, getEvent, isObject };
