interface QuadObject {
	x: number;
	y: number;
	w: number;
	h: number;
}

export function pointWithin(px: number, py: number, rlft: number, rtop: number, rrgt: number, rbtm: number): boolean {
	return px >= rlft && px <= rrgt && py >= rtop && py <= rbtm;
}

const MAX_OBJECTS = 10;
const MAX_LEVELS = 4;

export class Quadtree {
	x: number;
	y: number;
	w: number;
	h: number;
	l: number;
	o: QuadObject[];
	q: Quadtree[] | null;

	constructor(x: number, y: number, w: number, h: number, l: number = 0) {
		this.x = x;
		this.y = y;
		this.w = w;
		this.h = h;
		this.l = l;
		this.o = [];
		this.q = null;
	}

	split(): void {
		const x = this.x;
		const y = this.y;
		const w = this.w / 2;
		const h = this.h / 2;
		const l = this.l + 1;

		this.q = [
			// top right
			new Quadtree(x + w, y, w, h, l),
			// top left
			new Quadtree(x, y, w, h, l),
			// bottom left
			new Quadtree(x, y + h, w, h, l),
			// bottom right
			new Quadtree(x + w, y + h, w, h, l),
		];
	}

	// invokes callback with index of each overlapping quad
	quads(x: number, y: number, w: number, h: number, cb: (quad: Quadtree) => void): void {
		if (!this.q) return;

		const hzMid = this.x + this.w / 2;
		const vtMid = this.y + this.h / 2;
		const startIsNorth = y < vtMid;
		const startIsWest = x < hzMid;
		const endIsEast = x + w > hzMid;
		const endIsSouth = y + h > vtMid;

		// top-right quad
		startIsNorth && endIsEast && cb(this.q[0]);
		// top-left quad
		startIsWest && startIsNorth && cb(this.q[1]);
		// bottom-left quad
		startIsWest && endIsSouth && cb(this.q[2]);
		// bottom-right quad
		endIsEast && endIsSouth && cb(this.q[3]);
	}

	add(o: QuadObject): void {
		if (this.q !== null) {
			this.quads(o.x, o.y, o.w, o.h, q => {
				q.add(o);
			});
		} else {
			this.o.push(o);
			if (this.o.length > MAX_OBJECTS && this.l < MAX_LEVELS) {
				this.split();
				for (const obj of this.o) {
					this.quads(obj.x, obj.y, obj.w, obj.h, q => {
						q.add(obj);
					});
				}
				this.o = []; // Clear the array instead of setting length to 0
			}
		}
	}

	get(x: number, y: number, w: number, h: number, cb: (obj: QuadObject) => void): void {
		for (const obj of this.o) {
			cb(obj);
		}

		if (this.q !== null) {
			this.quads(x, y, w, h, q => {
				q.get(x, y, w, h, cb);
			});
		}
	}

	clear(): void {
		this.o = [];
		this.q = null;
	}
}