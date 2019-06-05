#!/usr/bin/env node
const { version } = require('./package.json');
const program = require('commander');
const chalk = require('chalk');
const ora = require('ora');
const vibrant = require('node-vibrant');

program
  .version(version)
  .arguments('<file>')
  .option(
    '-q, --quality <n>',
    'Quality: Scale down factor used in downsampling stage. 1 means no downsampling. If maxDimension is set, this value will not be used. Default: 5.',
    parseInt
  )
  .option(
    '-c, --color-count <n>',
    'Color count: amount of colors in initial palette from which the swatches will be generated. Default: 64',
    parseInt
  )
  .action(async path => {
    const spinner = ora('Calculating colors...').start();
    const { quality, colorCount } = program;
    try {
      const palette = await vibrant
        .from(path, {
          quality: quality || 5,
          colorCount: colorCount || 64
        })
        .getPalette();

      spinner.stop();

      for (const color in palette) {
        const hex = palette[color].getHex();
        console.log(chalk.hex(hex).bold(color), hex);
      }
    } catch (error) {
      spinner.stop();
      console.error(error.toString());
      process.exit(1);
    }
  });

program.parse(process.argv);
