import { none, Option, some } from "types/option";
import { ok, err, Result } from "types/result";

export type EmulatorState = {
  bitness: 8 | 16 | 32;
  cores: CoreState[];
  memory: Uint8Array | Uint16Array | Uint32Array;
  heapSize: number;
  stackSize: number;

  byteSize: number;
  wordSize: number;
  addressSize: number;
  maxSize: number;
};

type Register = AddressRegister | WordRegister;
type AddressRegister = {
  type: "address";
  bitwidths: {
    byte: number;
    address: number;
  };
  value: number;
};

type WordRegister = {
  type: "word";
  bitwidths: {
    byte: number;
    word: number;
  };
  value: number;
}

export type CoreState = {
  halted: boolean;
  bitness: 8 | 16 | 32;
  registers: Register[];
  port_mappings: {
    [port: number]: { out: (value: number) => void, in: () => number };
  };
  memoryctl: MemoryController;
  getRegister(index: number): Register;
  getRegisterSigned(index: number): Register;

  setRegister(index: number, value: number): void;
};

type MemoryController = {
  bitwidths: {
    byte: number;
    word: number;
    address: number;
    max: number;
  };
  getByte(address: number): Result<number, string>;
  getWord(address: number): Result<number, string>;
  getAddress(address: number): Result<number, string>;
  getInstruction(address: number): Result<number, string>;

  setByte(address: number, value: number): Option<string>;
  setWord(address: number, value: number): Option<string>;
  setAddress(address: number, value: number): Option<string>;

};
export function memory(emulator: EmulatorState) {
  const memoryctl: MemoryController = {
    bitwidths: {
      byte: emulator.byteSize,
      word: emulator.wordSize,
      address: emulator.addressSize,
      max: emulator.maxSize
    },
    getByte: (address: number) => {
      if (address < 0 || address >= emulator.memory.length) return err(`out of bounds memory byte fetch: ${address}`);
      return ok(emulator.memory[address])
    },
    getWord: (address: number) => {
      let value = 0;
      for (let i = 0; i < emulator.wordSize; i++) {
        value <<= (emulator.byteSize * 8);
        if (address + i < 0 || address + i >= emulator.memory.length) return err(`out of bounds memory word fetch: ${address}`);
        value |= emulator.memory[address + i];
      }
      return ok(value);
    },
    getAddress: (address: number) => {
      let value = 0;
      for (let i = 0; i < emulator.addressSize; i++) {
        value <<= (emulator.byteSize * 8);
        if (address + i < 0 || address + i >= emulator.memory.length) return err(`out of bounds memory address fetch: ${address}`);
        value |= emulator.memory[address + i];
      }
      return ok(value);
    },
    getInstruction: (address: number) => {
      if (emulator.byteSize == 1) {
        if (address < 0 || address >= emulator.memory.length) return err(`out of bounds memory instruction fetch: ${address}`);
        if (address + 1 < 0 || address + 1 >= emulator.memory.length) return err(`out of bounds memory instruction fetch: ${address}`);
        return ok(emulator.memory[address] << 8 | emulator.memory[address + 1]);
      } else {
        if (address < 0 || address >= emulator.memory.length) return err(`out of bounds memory instruction fetch: ${address}`);
        return ok(emulator.memory[address]);
      }
    },

    setByte: (address: number, value: number) => {
      if (address < 0 || address >= emulator.memory.length) return some(`out of bounds memory byte set: ${address}`);
      emulator.memory[address] = value;
      return none;
    },
    setWord: (address: number, value: number) => {
      for (let i = 0; i < emulator.wordSize; i++) {
        const val = value >> ((emulator.wordSize - i - 1) * emulator.byteSize * 8);
        if (address + i < 0 || address + i >= emulator.memory.length) return some(`out of bounds memory word set: ${address}`);
        emulator.memory[address + i] = val;
      };
      return none;
    },
    setAddress: (address: number, value: number) => {
      for (let i = 0; i < emulator.addressSize; i++) {
        const val = value >> ((emulator.addressSize - i - 1) * emulator.byteSize * 8);
        if (address + i < 0 || address + i >= emulator.memory.length) return some(`out of bounds memory word set: ${address}`);
        emulator.memory[address + i] = val;
      };
      return none;
    }
  };
  return memoryctl;
};

function register(emulator: EmulatorState, type: "address" | "word"): AddressRegister | WordRegister {
  if (type == "address") return {
    type: "address",
    bitwidths: {
      byte: emulator.byteSize,
      address: emulator.addressSize
    },
    value: 0
  };
  return {
    type: "word",
    bitwidths: {
      byte: emulator.byteSize,
      word: emulator.wordSize
    },
    value: 0
  };
};
export function core(emulator: EmulatorState, options: {
  bitness: 8 | 16 | 32,
  registers: {
    word: number,
    address: number,
  }
}) {
  const memoryctl = memory(emulator);
  const addressRegisters = Array.from({ length: options.registers.address + 2 }, () => register(emulator, "address"));
  const wordRegisters = Array.from({ length: options.registers.word }, () => register(emulator, "word"));
  addressRegisters[1].value = emulator.heapSize + emulator.stackSize;
  const constructed: CoreState = {
    memoryctl,
    bitness: options.bitness,
    halted: false,
    registers: [...addressRegisters, ...wordRegisters],
    port_mappings: {},
    getRegister(index: number) {
      return this.registers[index];
    },
    getRegisterSigned(index: number) {
      const register = this.registers[index];
      const wordBitwidth = emulator.wordSize * emulator.byteSize * 8;
      const addressBitwidth = emulator.addressSize * emulator.byteSize * 8;
      if (register.type == "word") return { bitwidths: register.bitwidths, type: register.type, value: (register.value << wordBitwidth) >> wordBitwidth };
      return { bitwidths: register.bitwidths, type: register.type, value: (register.value << addressBitwidth) >> addressBitwidth };
    },
    setRegister(index: number, value: number) {
      const register = this.registers[index];
      const wordBitwidth = emulator.wordSize * emulator.byteSize * 8;
      const addressBitwidth = emulator.addressSize * emulator.byteSize * 8;
      const mask = (1 << (register.type == "word" ? wordBitwidth : addressBitwidth)) - 1;
      register.value = mask == 0 ? value : value & mask;
    }
  };
  return constructed;
}

export function emulator(options: {
  bitness: 8 | 16 | 32,
  bitwidths: {
    byte: number;
    word: number;
    address: number;
  },
  memory: {
    heapSize: number;
    stackSize: number;
  }
}): Result<EmulatorState, string> {
  const ArrayType = options.bitwidths.byte == 1 ?
    Uint8Array : options.bitwidths.byte == 2 ?
      Uint16Array : Uint32Array;
  if (options.bitwidths.word < options.bitwidths.byte || options.bitwidths.address < options.bitwidths.word) return err("Invalid bitwidth supplied to emulator constructor");
  const constructed: EmulatorState = {
    bitness: options.bitness,
    cores: [],
    memory: new ArrayType(options.memory.heapSize + options.memory.stackSize),
    heapSize: options.memory.heapSize,
    stackSize: options.memory.stackSize,

    byteSize: options.bitwidths.byte,
    wordSize: options.bitwidths.word,
    addressSize: options.bitwidths.address,
    maxSize: options.bitwidths.address
  };

  return ok(constructed);
}
