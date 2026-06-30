---
title: "TypeScript 类型体操：从入门到精通"
date: "2026-05-28"
excerpt: "条件类型、映射类型、模板字面量类型——通过几个实际例子，理解类型体操到底在解决什么问题，而不是为了炫技。"
tags: ["TypeScript", "编程"]
---

"类型体操"常被当成炫技，但它真正的价值是：**让非法状态在编译期就无法表达**。下面用几个小例子说明。

## 条件类型：按输入决定输出

```ts
type Awaited<T> = T extends Promise<infer U> ? U : T;

type A = Awaited<Promise<string>>; // string
type B = Awaited<number>;          // number
```

`infer` 让我们"抓住"类型里的某一部分。它是类型体操里最常用的工具。

## 映射类型：批量改造

```ts
type Mutable<T> = {
  -readonly [K in keyof T]: T[K];
};
```

`-readonly` 去掉只读修饰，`-?` 去掉可选。映射类型让你**基于已有类型生成新类型**，而不是手写一遍。

## 什么时候该收手

类型体操是有成本的：太复杂的类型会拖慢编辑器、吓退后来者。我的判断标准很简单：

- 如果它帮调用方**少犯错**，值得
- 如果它只是让我显得聪明，删掉

> 好的类型像好的注释——存在感越低，价值越高。
