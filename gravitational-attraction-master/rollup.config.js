export default {
  input: 'index.js',
  output: {
    file: 'dist/main.js',
    format: 'iife',
    name: 'gravitational_attraction',
    sourcemap: 'inline'
  },
  watch: {
    exclude: ['node_modules/**']
  }
}
