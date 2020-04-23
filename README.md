# tpl

```javascript
process.env.NODE_PATH
process.env.PUBLIC_URL
// Source maps are resource heavy and can cause out of memory issue for large source files.
const shouldUseSourceMap = process.env.GENERATE_SOURCEMAP !== 'false';
// makes for a smoother build process.
const shouldInlineRuntimeChunk = process.env.INLINE_RUNTIME_CHUNK !== 'false';
process.env.IMAGE_INLINE_SIZE_LIMIT || '10000'
```
