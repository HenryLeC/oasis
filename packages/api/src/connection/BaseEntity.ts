import { allEntities, EntityData } from "./Entity";

type Constructor<T> = { new (): T };

export class BaseEntity {
  static _entity: EntityData;

  static get entity() {
    return (
      this._entity ||
      (this._entity = allEntities.find((e) => e.name === this.name))
    );
  }

  static async findOne<T extends BaseEntity>(
    this: Constructor<T>,
    id: string
  ): Promise<T> {
    const snap = await (this as any).entity.collection.doc(id).get();
    const data = snap.data();
    return { id, ...data };
  }

  static async find<T extends BaseEntity>(this: Constructor<T>): Promise<T[]> {
    const entity: EntityData = (this as any).entity;
    const all = await entity.collection.get();
    return all.docs.map((doc) => {
      const obj: any = {
        id: doc.id,
        ...doc.data(),
      };
      return obj as T;
    });
  }
}
