// The event collector is a class that may be used to push 'notifications' or 'events' to all interested listeners.
class EventAggregator
{
  private listeners: Array<ListenerWithUUID> = [];

  Invoke(type: string, value: unknown): void;
  Invoke(event: Event): void;

  Invoke(...args: Array<unknown>): void
  {
    // Handle parsing args due to overloads
    var type: string, value: unknown;
    if (args.length == 2)
    {
      type = args[0] as string;
      value = args[1];
    }
    else if (args.length == 1)
    {
      type = (args[0] as Event).type;
      value = (args[0] as Event).value;
    }

    if (type == null || type == undefined || value == null || value == undefined)
    {
      throw new Error("Invalid arguments to EventCollector.Invoke.");
    }

    // Invoke event
    this.listeners.forEach(listener =>
    {
      if (listener.type == type)
      {
        listener.callback(value);
      }
    });
  }

  Subscribe(type: string, callback: ListenerCallback): EventCollectorListenerID;
  Subscribe(listener: EventListener): EventCollectorListenerID;

  Subscribe(...args: Array<unknown>): EventCollectorListenerID
  {
    // Handle parsing arguments due to overloads
    var type: string, callback: ListenerCallback;
    if (args.length == 2)
    {
      type = args[0] as string;
      callback = args[1] as ListenerCallback;
    }
    else if (args.length == 1)
    {
      type = (args[0] as EventListener).type;
      callback = (args[0] as EventListener).callback;
    }
    if (type == null || type == undefined || callback == null || callback == undefined)
    {
      throw new Error("Invalid arguments to EventCollector.Invoke.");
    }

    // Subscribe to event.
    const uuid = crypto.randomUUID();
    this.listeners.push({
      type: type,
      callback: callback,
      UUID: uuid,
    });

    return uuid;
  }

  Unsubcribe(uuid: EventCollectorListenerID)
  {
    this.listeners = this.listeners.filter(x => x.UUID != uuid);
  }

  HasListener(type: string): boolean
  {
    for (const listener of this.listeners)
    {
      if (listener.type == type)
      {
        return true;
      }
    }

    return false;
  }
}

type EventCollectorListenerID = string;
type ListenerCallback = (value: unknown) => Promise<void> | void;

interface ListenerWithUUID extends EventListener
{
  UUID: EventCollectorListenerID;
}

interface Event
{
  type: string;
  value: unknown;
}

interface EventListener
{
  type: string;
  callback: ListenerCallback;
}

export default new EventAggregator();
export { EventAggregator, Event, EventListener };