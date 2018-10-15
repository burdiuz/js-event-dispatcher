import { Event, getEvent } from './Event';
import EventDispatcher, { create } from './EventDispatcher';
import { isObject } from './utils';

export default EventDispatcher;
export { Event, EventDispatcher, create, getEvent, isObject };
