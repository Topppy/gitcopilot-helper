// 给页面中.m-question-module 的类设置css样式 user-select: auto;，优先级最高,无法被覆盖,所有后代元素都不可选中 使用important
// 创建一个样式元素
var style = document.createElement("style");

// 添加 CSS 规则
style.innerHTML = `
* {
  user-select: auto !important;
}`;

// 将样式元素添加到页面的头部
document.head.appendChild(style);