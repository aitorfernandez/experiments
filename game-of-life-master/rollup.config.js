export default {
  input: 'index.js',
  output: {
    file: 'dist/main.js',
    format: 'iife',
    name: 'game_of_life',
    sourcemap: 'inline'
  },
  watch: {
    exclude: ['node_modules/**']
  }
}
