import { OrderedMap, Map } from 'immutable';

export function generateId() {
  return Date.now();
}

export function fbDataToEntities(data, RecordModel = Map) {
  return new OrderedMap(data).mapEntries(([uid, value]) => [
    uid,
    new RecordModel(value).set('uid', uid)
  ]);
}

export function arrToMap(arr, DataRecord = Map) {
  return arr.reduce(
    (acc, item) => acc.set(item.id, new DataRecord(item)),
    new OrderedMap({})
  );
}

export function mapToArr(obj) {
  return obj.valueSeq().toArray();
}
