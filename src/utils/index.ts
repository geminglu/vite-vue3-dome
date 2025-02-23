/**
 * 生成一个随机数
 * @param {number} min 最小值
 * @param  {number} max 最大值
 * @returns {number} 范围随机数
 */
export function randomNum(min: number, max: number): number {
  return Math.floor(Math.random() * (max - min) + min);
}

/**
 * 生成一个随机的颜色
 * @param {number} min 最小值
 * @param  {number} max 最大值
 * @returns {string}
 */
export function randomColor(min: number, max: number): string {
  const r = randomNum(min, max);
  const g = randomNum(min, max);
  const b = randomNum(min, max);
  return 'rgb(' + r + ',' + g + ',' + b + ')';
}

export function arrayToTree<T>(list: any[], root = null) {
  const result: T[] = []; // 用于存放结果
  const map: any = {}; // 用于存放 list 下的节点

  // 1. 遍历 list，将 list 下的所有节点以 id 作为索引存入 map
  for (const item of list) {
    map[item.id] = { ...item }; // 浅拷贝
  }

  // 2. 再次遍历，将根节点放入最外层，子节点放入父节点
  for (const item of list) {
    // 3. 获取节点的 id 和 父 id
    const { id, pid } = item; // ES6 解构赋值
    // 4. 如果是根节点，存入 result
    if (pid === root || map[pid] === undefined) {
      result.push(map[id]);
    } else {
      // 5. 反之，存入到父节点
      if (map[pid])
        map[pid].children ? map[pid].children.push(map[id]) : (map[pid].children = [map[id]]);
    }
  }

  // 将结果返回
  return result;
}

/** hex转rgb */
function hexToRgb(str: string) {
  const hxs: any = str.replace('#', '').match(/../g);
  for (let i = 0; i < 3; i++) hxs[i] = parseInt(hxs[i], 16);
  return hxs;
}

/** rgb转hex */
function rgbToHex(a: number, b: number, c: number) {
  const hexs = [a.toString(16), b.toString(16), c.toString(16)];
  for (let i = 0; i < 3; i++) {
    if (hexs[i].length === 1) hexs[i] = `0${hexs[i]}`;
  }
  return `#${hexs.join('')}`;
}

/** 加深颜色值 */
export function darken(color: string, level: number) {
  const rgbc = hexToRgb(color);
  for (let i = 0; i < 3; i++) rgbc[i] = Math.floor(rgbc[i] * (1 - level));
  return rgbToHex(rgbc[0], rgbc[1], rgbc[2]);
}

/** 变浅颜色值 */
export function lighten(color: string, level: number) {
  const rgbc = hexToRgb(color);
  for (let i = 0; i < 3; i++) rgbc[i] = Math.floor((255 - rgbc[i]) * level + rgbc[i]);
  return rgbToHex(rgbc[0], rgbc[1], rgbc[2]);
}

/**
 * 复制文本
 * @param text
 */
export function copyToClip(text: string) {
  return new Promise((resolve, reject) => {
    try {
      const input: HTMLTextAreaElement = document.createElement('textarea');
      input.setAttribute('readonly', 'readonly');
      input.value = text;
      document.body.appendChild(input);
      input.select();
      if (document.execCommand('copy')) document.execCommand('copy');
      document.body.removeChild(input);
      resolve(text);
    } catch (error) {
      reject(error);
    }
  });
}
/**
 * 树型结构平铺
 * @param tree 树型数组
 * @returns 平铺后的数据
 */
export function flattenTree(tree: any[]): any[] {
  const result = [];
  const queue = deepClone(tree);

  while (queue.length > 0) {
    const node = queue.shift();
    result.push(node);

    if (node.children && node.children.length > 0) {
      queue.push(...node.children); // 将子节点加入队列
    }
  }

  return result;
}

/**
 * 深拷贝
 * @param source
 */
export function deepClone(source: any) {
  // 过滤特殊情况
  if (source === null) return null;
  if (typeof source !== 'object') return source;
  if (source.constructor === RegExp) return new RegExp(source);
  if (source.constructor === Date) return new Date(source);
  const newObj = new source.constructor();
  for (const key in source) {
    // eslint-disable-next-line no-prototype-builtins
    if (source.hasOwnProperty(key)) {
      newObj[key] = deepClone(source[key]);
    }
  }
  return newObj;
}
