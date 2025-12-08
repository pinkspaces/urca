import { Argument, fetch, RegisterArgument } from "./fetch";
import { Ports } from "./ports";
import { CoreState, EmulatorState } from "./state";

const PC: RegisterArgument = { type: "register", value: 0 };

function get(core: CoreState, value: Argument) {
  switch (value.type) {
    case "register": {
      return core.getRegister(value.value).value;
    }
    case "max":
    case "word":
    case "address": {
      return value.value;
    }
    case "port": {
      console.log(`[in%${Ports[value.value].name}]`);
      return core.port_mappings[value.value].in();
    }
  }
}

function get_signed(core: CoreState, value: Argument) {
  switch (value.type) {
    case "register": {
      return core.getRegisterSigned(value.value).value;
    }
    case "word":
    case "address":
    case "max": {
      const amount = 32 - core.memoryctl.bitwidths[value.type];
      return (value.value << amount) >> amount;
    }
    case "port": {
      console.log(`[in%${Ports[value.value].name}]`);
      return core.port_mappings[value.value].in();
    }
  }
}


function set(core: CoreState, destination: Argument, value: number) {
  switch (destination.type) {
    case "register": {
      return core.setRegister(destination.value, value);
    }
    case "port": {
      console.log(`[out%${Ports[destination.value]}] ${value}`)
      core.port_mappings[destination.value].out(value);
      break;
    }
  }
}

function get_address(core: CoreState, value: Argument): number {
  switch (value.type) {
    case "address": return value.value;
    case "register": return core.getRegister(value.value).value;
  }
  return -1;
}
function set_address(core: CoreState, destination: Argument, value: number) {
  switch (destination.type) {
    case "register": return core.setRegister(destination.value, value);
  }
  return -1;
}

export function step(core: CoreState) {
  if (core.halted) return;
  const instructionResult = fetch(core);
  if (instructionResult.is_err()) return instructionResult;
  const instruction = instructionResult.unwrap();

  switch (instruction.name) {
    case "add": {
      const left = get_signed(core, instruction.arguments[1]);
      const right = get_signed(core, instruction.arguments[2]);
      set(core, instruction.arguments[0], left + right);
      break;
    };
    case "rsh": {
      const value = get(core, instruction.arguments[1]);
      set(core, instruction.arguments[0], value >>> 1);
      break;
    };
    case "lod": {
      const addr = get_address(core, instruction.arguments[1]);
      const memval = core.memoryctl.getWord(addr);
      if (memval.is_err()) return memval;
      set(core, instruction.arguments[0], memval.unwrap());
      break;
    }
    case "str": {
      const addr = get_address(core, instruction.arguments[0]);
      core.memoryctl.setWord(addr, get(core, instruction.arguments[1]));
      break;
    }
    case "bge": {
      const left = get(core, instruction.arguments[1]);
      const right = get(core, instruction.arguments[2]);
      const addr = get_address(core, instruction.arguments[0]);
      if (left >= right) set_address(core, PC, addr);
      break;
    }
    case "nor": {
      const left = get(core, instruction.arguments[1]);
      const right = get(core, instruction.arguments[2]);
      set(core, instruction.arguments[0], ~(left | right));
      break;
    }
    case "sub": {
      const left = get(core, instruction.arguments[1]);
      const right = get(core, instruction.arguments[2]);
      set(core, instruction.arguments[0], left - right);
      break;
    }
    case "jmp": {
      const addr = get_address(core, instruction.arguments[0]);
      set_address(core, PC, addr);
      break;
    }
    case "mov": {
      const value = get(core, instruction.arguments[1]);
      set(core, instruction.arguments[0], value);
      break;
    }
    case 'nop': {
      break;
    }
    case "imm": {
      const value = get(core, instruction.arguments[1]);
      set(core, instruction.arguments[0], value);
      break;
    }
    case "lsh": {
      const value = get(core, instruction.arguments[1]);
      set(core, instruction.arguments[0], value << 1);
      break;
    }
    case "inc": {
      const value = get_signed(core, instruction.arguments[1]);
      set(core, instruction.arguments[0], value + 1);
      break;
    }
    case "dec": {
      const value = get_signed(core, instruction.arguments[1]);
      set(core, instruction.arguments[0], value - 1);
      break;
    }
    case "neg": {
      const value = get_signed(core, instruction.arguments[1]);
      set(core, instruction.arguments[0], -value);
      break;
    }

    case "and": {
      const left = get(core, instruction.arguments[1]);
      const right = get(core, instruction.arguments[2]);
      set(core, instruction.arguments[0], left & right);
      break;
    }
    case "or": {
      const left = get(core, instruction.arguments[1]);
      const right = get(core, instruction.arguments[2]);
      set(core, instruction.arguments[0], left | right);
      break;
    }
    case "not": {
      const value = get(core, instruction.arguments[1]);
      set(core, instruction.arguments[0], ~value);
      break;
    }
    case "xnor": {
      const left = get(core, instruction.arguments[1]);
      const right = get(core, instruction.arguments[2]);
      set(core, instruction.arguments[0], ~(left ^ right));
      break;
    }
    case "xor": {
      const left = get(core, instruction.arguments[1]);
      const right = get(core, instruction.arguments[2]);
      set(core, instruction.arguments[0], left ^ right);
      break;
    }
    case "nand": {
      const left = get(core, instruction.arguments[1]);
      const right = get(core, instruction.arguments[2]);
      set(core, instruction.arguments[0], ~(left & right));
      break;
    }
    case "brl": {
      const left = get(core, instruction.arguments[1]);
      const right = get(core, instruction.arguments[2]);
      const addr = get_address(core, instruction.arguments[0])!;
      if (left < right) set_address(core, PC, addr);
      break;
    };
    case "brg": {
      const left = get(core, instruction.arguments[1]);
      const right = get(core, instruction.arguments[2]);
      const addr = get_address(core, instruction.arguments[0]);
      if (left > right) set_address(core, PC, addr);
      break;
    };
    case "bge": {
      const left = get(core, instruction.arguments[1]);
      const right = get(core, instruction.arguments[2]);
      const addr = get_address(core, instruction.arguments[0]);
      if (left == right) set_address(core, PC, addr);
      break;
    };
    case "bne": {
      const left = get(core, instruction.arguments[1]);
      const right = get(core, instruction.arguments[2]);
      const addr = get_address(core, instruction.arguments[0]);
      if (left != right) set_address(core, PC, addr);
      break;
    };
    case "bod": {
      const value = get(core, instruction.arguments[1]);
      const addr = get_address(core, instruction.arguments[0]);
      if (value % 2 == 1) set_address(core, PC, addr);
      break;
    };
    case "bev": {
      const value = get(core, instruction.arguments[1]);
      const addr = get_address(core, instruction.arguments[0]);
      if (value % 2 == 0) set_address(core, PC, addr);
      break;
    };
    case "ble": {
      const left = get(core, instruction.arguments[1]);
      const right = get(core, instruction.arguments[2]);
      const addr = get_address(core, instruction.arguments[0]);
      if (left <= right) set_address(core, PC, addr);
      break;
    };
    case "brz": {
      const value = get(core, instruction.arguments[1]);
      const addr = get_address(core, instruction.arguments[0]);
      if (value == 0) set_address(core, PC, addr);
      break;
    };
    case "bnz": {
      const value = get(core, instruction.arguments[1]);
      const addr = get_address(core, instruction.arguments[0]);
      if (value != 0) set_address(core, PC, addr);
      break;
    };
    case "brn": {
      const value = get(core, instruction.arguments[1]);

      const addr = get_address(core, instruction.arguments[0]);
      if ((value & (1 << (core.bitness - 1))) != 0) set_address(core, PC, addr);
      break;
    };
    case "brp": {
      const value = get(core, instruction.arguments[1]);

      const addr = get_address(core, instruction.arguments[0]);
      if ((value & (1 << (core.bitness - 1))) == 0) set_address(core, PC, addr);
      break;
    };

    case "psh": {
      const value = get(core, instruction.arguments[0]);
      core.setRegister(1, core.getRegister(1).value - core.memoryctl.bitwidths.word);
      core.memoryctl.setWord(core.getRegister(1).value, value);
      break;
    }
    case "pop": {
      const value = core.memoryctl.getWord(core.getRegister(1).value);
      core.setRegister(1, core.getRegister(1).value + core.memoryctl.bitwidths.word);
      set(core, instruction.arguments[0], value.unwrap());
      break;
    }
    case 'cal': {
      const addr = get_address(core, instruction.arguments[0]);
      core.setRegister(1, core.getRegister(1).value - core.memoryctl.bitwidths.address);
      core.memoryctl.setAddress(core.getRegister(1).value, core.getRegister(0).value);
      set_address(core, PC, addr);
      break;
    }
    case 'ret': {
      const addr = core.memoryctl.getAddress(core.getRegister(1).value);
      core.setRegister(1, core.getRegister(1).value + core.memoryctl.bitwidths.address);
      set_address(core, PC, addr.unwrap());
      break;
    }
    case 'hlt': {
      core.halted = true;
      break;
    }
    case 'cpy': {
      const value = core.memoryctl.getWord(get_address(core, instruction.arguments[1]));
      core.memoryctl.setWord(get_address(core, instruction.arguments[0]), value.unwrap());
      break;
    }

    case 'brc': {
      const addr = get_address(core, instruction.arguments[0]);
      const left = get(core, instruction.arguments[1]);
      const right = get(core, instruction.arguments[2]);
      if (left + right >= 1 << core.bitness) set_address(core, PC, addr);
      break;
    }
    case 'bnc': {
      const addr = get_address(core, instruction.arguments[0]);
      const left = get(core, instruction.arguments[1]);
      const right = get(core, instruction.arguments[2]);
      if (left + right < 1 << core.bitness) set_address(core, PC, addr);
      break;
    }

    case 'mlt': {
      const left = get(core, instruction.arguments[1]);
      const right = get(core, instruction.arguments[2]);
      set(core, instruction.arguments[0], left * right);
      break;
    }
    case 'umlt': {
      const left = get(core, instruction.arguments[1]);
      const right = get(core, instruction.arguments[2]);
      set(core, instruction.arguments[0], (left * right) >>> core.memoryctl.bitwidths.word);
      break;
    }

    case 'sumlt': {
      const left = get_signed(core, instruction.arguments[1]);
      const right = get_signed(core, instruction.arguments[2]);
      set(core, instruction.arguments[0], (left * right) >> core.memoryctl.bitwidths.word);
      break;
    }

    case 'div': {
      const left = get(core, instruction.arguments[1]);
      const right = get(core, instruction.arguments[2]);
      set(core, instruction.arguments[0], Math.floor(left / right));
      break;
    }
    case 'mod': {
      const left = get(core, instruction.arguments[1]);
      const right = get(core, instruction.arguments[2]);
      set(core, instruction.arguments[0], left % right);
      break;
    }
    case 'bsr': {
      const left = get(core, instruction.arguments[1]);
      const right = get(core, instruction.arguments[2]);
      set(core, instruction.arguments[0], left >>> right);
      break;
    }
    case 'bsl': {
      const left = get(core, instruction.arguments[1]);
      const right = get(core, instruction.arguments[2]);
      set(core, instruction.arguments[0], left << right);
      break;
    }
    case 'srs': {
      const left = get(core, instruction.arguments[1]);
      set(core, instruction.arguments[0], left >> 1);
      break;
    }
    case 'bss': {
      const left = get(core, instruction.arguments[1]);
      const right = get(core, instruction.arguments[2]);
      set(core, instruction.arguments[0], left >> right);
      break;
    }
    case 'sete': {
      const left = get(core, instruction.arguments[1]);
      const right = get(core, instruction.arguments[2]);
      set(core, instruction.arguments[0], left == right ? (1 << core.bitness) - 1 : 0);
      break;
    }
    case 'setne': {
      const left = get(core, instruction.arguments[1]);
      const right = get(core, instruction.arguments[2]);
      set(core, instruction.arguments[0], left != right ? (1 << core.bitness) - 1 : 0);
      break;
    }
    case 'setg': {
      const left = get(core, instruction.arguments[1]);
      const right = get(core, instruction.arguments[2]);
      set(core, instruction.arguments[0], left > right ? (1 << core.bitness) - 1 : 0);
      break;
    }
    case 'setl': {
      const left = get(core, instruction.arguments[1]);
      const right = get(core, instruction.arguments[2]);
      set(core, instruction.arguments[0], left < right ? (1 << core.bitness) - 1 : 0);
      break;
    }
    case 'setge': {
      const left = get(core, instruction.arguments[1]);
      const right = get(core, instruction.arguments[2]);
      set(core, instruction.arguments[0], left >= right ? (1 << core.bitness) - 1 : 0);
      break;
    }
    case 'setle': {
      const left = get(core, instruction.arguments[1]);
      const right = get(core, instruction.arguments[2]);
      set(core, instruction.arguments[0], left <= right ? (1 << core.bitness) - 1 : 0);
      break;
    }
    case 'setc': {
      const left = get(core, instruction.arguments[1]);
      const right = get(core, instruction.arguments[2]);
      set(core, instruction.arguments[0], (left + right >= (1 << core.bitness)) ? (1 << core.bitness) - 1 : 0);
      break;
    }
    case 'setnc': {
      const left = get(core, instruction.arguments[1]);
      const right = get(core, instruction.arguments[2]);
      set(core, instruction.arguments[0], (left + right < (1 << core.bitness)) ? (1 << core.bitness) - 1 : 0);
      break;
    }

    case 'llod': {
      const base = get_address(core, instruction.arguments[1]);
      const offset = get(core, instruction.arguments[2]);
      set(core, instruction.arguments[0], core.memoryctl.getWord(base + offset).unwrap());
      break;
    }
    case 'lstr': {
      const dst = get_address(core, instruction.arguments[0]);
      const offset = get(core, instruction.arguments[1]);
      core.memoryctl.setWord(dst + offset, get(core, instruction.arguments[2]));
      break;
    }
    case 'sdiv': {
      const left = get_signed(core, instruction.arguments[1]);
      const right = get_signed(core, instruction.arguments[2]);
      set(core, instruction.arguments[0], Math.floor(left / right));
      break;
    }
    case 'sbrl': {
      const addr = get_address(core, instruction.arguments[0])
      const left = get_signed(core, instruction.arguments[1]);
      const right = get_signed(core, instruction.arguments[2]);
      if (left < right) set_address(core, PC, addr);
      break;
    }
    case 'sbrg': {
      const addr = get_address(core, instruction.arguments[0])
      const left = get_signed(core, instruction.arguments[1]);
      const right = get_signed(core, instruction.arguments[2]);
      if (left > right) set_address(core, PC, addr);
      break;
    }
    case 'sble': {
      const addr = get_address(core, instruction.arguments[0])
      const left = get_signed(core, instruction.arguments[1]);
      const right = get_signed(core, instruction.arguments[2]);
      if (left <= right) set_address(core, PC, addr);
      break;
    }
    case 'sbge': {
      const addr = get_address(core, instruction.arguments[0])
      const left = get_signed(core, instruction.arguments[1]);
      const right = get_signed(core, instruction.arguments[2]);
      if (left >= right) set_address(core, PC, addr);
      break;
    }
    case 'ssetl': {
      const left = get_signed(core, instruction.arguments[1]);
      const right = get_signed(core, instruction.arguments[2]);
      set(core, instruction.arguments[0], left < right ? (1 << core.bitness) - 1 : 0);
      break;
    }
    case 'ssetg': {
      const left = get_signed(core, instruction.arguments[1]);
      const right = get_signed(core, instruction.arguments[2]);
      set(core, instruction.arguments[0], left > right ? (1 << core.bitness) - 1 : 0);
      break;
    }
    case 'ssetle': {
      const left = get_signed(core, instruction.arguments[1]);
      const right = get_signed(core, instruction.arguments[2]);
      set(core, instruction.arguments[0], left <= right ? (1 << core.bitness) - 1 : 0);
      break;
    }
    case 'ssetge': {
      const left = get_signed(core, instruction.arguments[1]);
      const right = get_signed(core, instruction.arguments[2]);
      set(core, instruction.arguments[0], left >= right ? (1 << core.bitness) - 1 : 0);
      break;
    }
    case 'abs': {
      const value = get_signed(core, instruction.arguments[1]);
      set(core, instruction.arguments[0], Math.abs(value));
      break;
    }
    case 'in': {
      const value = get(core, instruction.arguments[1]);
      set(core, instruction.arguments[0], value);
      break;
    }
    case 'out': {
      const value = get(core, instruction.arguments[1]);
      set(core, instruction.arguments[0], value);
      break;
    }

    case "adda": {
      const left = get_address(core, instruction.arguments[1]);
      const right = get(core, instruction.arguments[2]);
      set_address(core, instruction.arguments[0], left + right);
      break;
    }

    case "addaa": {
      const left = get_address(core, instruction.arguments[1]);
      const right = get_address(core, instruction.arguments[2]);
      set_address(core, instruction.arguments[0], left + right);
      break;
    }

    case "suba": {
      const left = get_address(core, instruction.arguments[1]);
      const right = get(core, instruction.arguments[2]);
      set_address(core, instruction.arguments[0], left - right);
      break;
    }

    case "subaa": {
      const left = get_address(core, instruction.arguments[1]);
      const right = get_address(core, instruction.arguments[2]);
      set_address(core, instruction.arguments[0], left - right);
      break;
    }

    case "extb": {
      const value = get(core, instruction.arguments[1]);
      const amount = 32 - core.memoryctl.bitwidths.byte;
      const nval = (value << (32 - amount)) >> (32 - amount);
      set(core, instruction.arguments[0], nval);
      break;
    };
    case "extw": {
      const value = get(core, instruction.arguments[1]);
      const amount = 32 - core.memoryctl.bitwidths.word;
      const nval = (value << (32 - amount)) >> (32 - amount);
      set_address(core, instruction.arguments[0], nval);
      break;
    };

    case "mova": {
      const value = get(core, instruction.arguments[1]);
      set_address(core, instruction.arguments[0], value);
      break;
    };

    case "movaa": {
      const value = get_address(core, instruction.arguments[1]);
      set_address(core, instruction.arguments[0], value);
      break;
    }

    case "psha": {
      const value = get_address(core, instruction.arguments[0]);
      core.setRegister(1, core.getRegister(1).value - core.memoryctl.bitwidths.address);
      core.memoryctl.setAddress(core.getRegister(1).value, value);
      break;
    }
    case "popa": {
      const value = core.memoryctl.getAddress(core.getRegister(1).value);
      core.setRegister(1, core.getRegister(1).value + core.memoryctl.bitwidths.address);
      set_address(core, instruction.arguments[0], value.unwrap());
      break;
    }
    case "lodb": {
      const addr = get_address(core, instruction.arguments[1]);
      const value = core.memoryctl.getByte(addr).unwrap();
      set(core, instruction.arguments[0], value);
      break;
    }
    case "strb": {
      const addr = get_address(core, instruction.arguments[0]);
      const value = get(core, instruction.arguments[1]);
      core.memoryctl.setByte(addr, value);
      break;
    }
    case "llodb": {
      const addr = get_address(core, instruction.arguments[1]);
      const offset = get(core, instruction.arguments[2]);
      set(core, instruction.arguments[0], core.memoryctl.getByte(addr + offset).unwrap());
      break;
    }
    case "lstrb": {
      const addr = get_address(core, instruction.arguments[0]);
      const offset = get(core, instruction.arguments[1]);
      core.memoryctl.setByte(addr + offset, get(core, instruction.arguments[2]));
      break;
    }
    case "loda": {
      const addr = get_address(core, instruction.arguments[1]);
      const value = core.memoryctl.getAddress(addr).unwrap();
      set_address(core, instruction.arguments[0], value);
      break;
    }
    case "stra": {
      const addr = get_address(core, instruction.arguments[0]);
      const value = get_address(core, instruction.arguments[1]);
      core.memoryctl.setAddress(addr, value);
      break;
    }
    case "lloda": {
      const addr = get_address(core, instruction.arguments[1]);
      const offset = get(core, instruction.arguments[2]);
      set_address(core, instruction.arguments[0], core.memoryctl.getAddress(addr + offset).unwrap());
      break;
    }
    case "lstra": {
      const addr = get_address(core, instruction.arguments[0]);
      const offset = get(core, instruction.arguments[1]);
      core.memoryctl.setAddress(addr + offset, get_address(core, instruction.arguments[2]));
      break;
    }

    case "alignw": {
      const addr = get_address(core, instruction.arguments[1]);
      const missing = core.memoryctl.bitwidths.word - addr % core.memoryctl.bitwidths.word;
      if (missing == core.memoryctl.bitwidths.word)
        set_address(core, instruction.arguments[0], addr);
      else set_address(core, instruction.arguments[0], addr + missing);
      break;
    };
    case 'aligna': {
      const addr = get_address(core, instruction.arguments[1]);
      const missing = core.memoryctl.bitwidths.address - addr % core.memoryctl.bitwidths.address;
      if (missing == core.memoryctl.bitwidths.address)
        set_address(core, instruction.arguments[0], addr);
      else set_address(core, instruction.arguments[0], addr + missing);
      break;
    }
    case 'alignm': {
      const addr = get_address(core, instruction.arguments[1]);
      const missing = core.memoryctl.bitwidths.max - addr % core.memoryctl.bitwidths.max;
      if (missing == core.memoryctl.bitwidths.max)
        set_address(core, instruction.arguments[0], addr);
      else set_address(core, instruction.arguments[0], addr + missing);
      break;
    }
  };
}
