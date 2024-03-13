export default function html([first, ...strings], ...values) {
  return values
    .reduce((acc, cur) => acc.concat(cur, strings.shift()), [first])
    .filter((x) => (x && x !== true) || x === 0)
    .join("");
}

export function createStore(reducer) {
  let state = reducer();
  const roots = new Map();
  // Map() là object đặc biệt - có tính chất lặp qua nó
  // key của object Map có thể được đặt tên bằng bất kỳ kiểu dữ liệu nào

  function render() {
    for (const [root, component] of roots) {
      const output = component();
      root.innerHTML = output;
    }
  }

  return {
    // Method nhận cái view đẩy ra root
    attach(component, root) {
      roots.set(root, component);
      render();
    },

    // Method đẩy dữ liệu từ store ra view
    connect(selector = (state) => state) {
      return (component) =>
        (props, ...args) =>
          component(Object.assign({}, props, selector(state), ...args));
    },
    // Method mô tả hành động được nhận lại từ view -> truyền mô tả hành động cho reducer thực thi
    dispatch(action, ...args) {
      state = reducer(state, action, args);
      render();
    },
  };
}
