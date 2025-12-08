import { core, emulator, EmulatorState } from "emulator/state"
import { none, Option, some } from "types/option";
import { Result, ok, err, safecall } from "types/result"
import readline from "readline/promises";
import { warn } from "console";
import { step } from "emulator/execute";

const rl = readline.createInterface(process.stdin, process.stdout);

type CLIState = {
  emulator: EmulatorState;
}
function new_cli(options: {
  bitness: 8 | 16 | 32,
  bitwidths: {
    byte: number;
    word: number;
    address: number;
  },
  memory: {
    heapSize: number,
    stackSize: number
  },
  cores: number,
  registers: {
    word: number,
    address: number
  }
}): Result<CLIState, string> {
  const e = emulator({
    bitness: options.bitness,
    bitwidths: options.bitwidths,
    memory: options.memory
  }).unwrap();
  const state: CLIState = { emulator: e };
  for (let i = 0; i < options.cores; i++) {
    const c = core(state.emulator, {
      bitness: options.bitness,
      registers: options.registers
    })
    state.emulator.cores.push(c);
  }
  return ok(state);
}

function poke(cli: CLIState, address: number, value: number): Option<string> {
  if (address < 0 || address >= cli.emulator.memory.length) return some("Emulator error: Address is invalid");
  cli.emulator.memory[address] = value;
  return none;
}

function parse(command: string, cli: CLIState): Option<string> {
  const parts = command.split(/\s+/gmi);
  if (['quit', 'close'].includes(parts[0])) {
    rl.close();
    return some("close");
  }
  if (parts[0] == 'dump') {
    if (parts[1] == 'core') {
      const core = parseInt(parts[2]);
      if (Number.isNaN(core)) return some(`bad core index supplied; expected number from 0 to ${cli.emulator.cores.length - 1}`);
      if (core < 0 || core >= cli.emulator.cores.length) return some(`bad core index supplied; expected to be in bounds from 0 to ${cli.emulator.cores.length - 1}`);
      console.log(cli.emulator.cores[core]);

    };
    if (parts[1] == 'emulator') {
      console.log(cli.emulator);
    }
    if (parts[1] == 'memory') {
      if (parts[2] == 'range') {
        const address = parseInt(parts[3]);
        const offset = parseInt(parts[4]);
        if (address < 0 || address >= cli.emulator.memory.length || Number.isNaN(address)) return some(`bad base memory address supplied; expected number from 0 to ${cli.emulator.memory.length - 1}`);
        if (offset < 0 || offset >= cli.emulator.memory.length || Number.isNaN(offset)) return some(`bad base memory address supplied; expected number from 0 to ${cli.emulator.memory.length - 1}`);
        const view = cli.emulator.memory.slice(Math.min(address, offset), Math.max(address, offset));
        console.log(view);
      }
      if (parts[2] == 'address') {
        const address = parseInt(parts[3]);
        if (address < 0 || address >= cli.emulator.memory.length || Number.isNaN(address)) return some(`bad base memory address supplied; expected number from 0 to ${cli.emulator.memory.length - 1}`);
        console.log(cli.emulator.memory[address]);
      }
    }
  };
  if (parts[0] == 'poke') {
    const address = parseInt(parts[1]);
    const value = parseInt(parts[2]);
    if (Number.isNaN(value)) return some(`value provided is not a number`);
    if (address < 0 || address >= cli.emulator.memory.length || Number.isNaN(address)) return some(`bad base memory address supplied; expected number from 0 to ${cli.emulator.memory.length - 1}`);
    poke(cli, address, value);
  }

  if (parts[0] == 'step') {
    for (const core of cli.emulator.cores) {
      if (!core.halted) step(core);
    }
  }


  return none;
};

export async function start() {
  const bitsResult = await safecall(rl.question("bits? > "));
  const coreResult = await safecall(rl.question("cores? > "));
  const byteWidthResult = await safecall(rl.question("byte width? > "));
  const wordWidthResult = await safecall(rl.question("word width in bytes? > "));
  const addressWidthResult = await safecall(rl.question("address width in bytes? > "));
  const wordRegistersResult = await safecall(rl.question("word registers? > "));
  const addressRegistersResult = await safecall(rl.question("address registers? > "));
  const memoryResult = await safecall(rl.question("memory? > "));
  const stackResult = await safecall(rl.question("stack size? > "));
  if (bitsResult.is_err()) return bitsResult;
  if (coreResult.is_err()) return coreResult;
  if (wordRegistersResult.is_err()) return wordRegistersResult;
  if (addressRegistersResult.is_err()) return addressRegistersResult;
  if (byteWidthResult.is_err()) return byteWidthResult;
  if (addressWidthResult.is_err()) return addressWidthResult;
  if (wordWidthResult.is_err()) return wordWidthResult;
  if (memoryResult.is_err()) return memoryResult;
  if (stackResult.is_err()) return stackResult;
  const bits = parseInt(bitsResult.unwrap());
  const cores = parseInt(coreResult.unwrap());
  const wordRegisters = parseInt(wordRegistersResult.unwrap());
  const addressRegisters = parseInt(addressRegistersResult.unwrap());
  const byteWidth = parseInt(byteWidthResult.unwrap());
  const wordWidth = parseInt(wordWidthResult.unwrap());
  const addressWidth = parseInt(addressWidthResult.unwrap());
  const memory = parseInt(memoryResult.unwrap());
  const stack = parseInt(stackResult.unwrap());
  if (Number.isNaN(bits) || Number.isNaN(cores) || Number.isNaN(wordRegisters) || Number.isNaN(addressRegisters) || Number.isNaN(byteWidth) || Number.isNaN(wordWidth) || Number.isNaN(addressWidth) || Number.isNaN(memory) || Number.isNaN(stack)) return err("invalid supplied values");
  if (bits != 8 && bits != 16 && bits != 32) return err("incompatible bit amount");
  const state = new_cli({
    bitness: bits,
    cores,
    memory: {
      stackSize: stack,
      heapSize: memory,
    },
    bitwidths: {
      byte: byteWidth,
      word: wordWidth,
      address: addressWidth
    },
    registers: {
      word: wordRegisters,
      address: addressRegisters
    }
  });
  if (state.is_err()) return state;

  loop: while (true) {
    const command = await safecall(rl.question("> "));
    if (command.is_err()) {
      rl.close();
      return command;
    }
    const result = parse(command.unwrap(), state.unwrap());
    if (result.is_some()) {
      switch (result.unwrap()) {
        case 'close': break loop;
        default: console.log(result.unwrap());
      }
    }
  };
};
