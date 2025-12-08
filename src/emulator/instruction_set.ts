type Argument = ByteArgument | WordArgument | AddressArgument | MaxArgument | RegisterArgument | PortArgument;
type ByteArgument = { type: "word" };
type WordArgument = { type: "word" };
type AddressArgument = { type: "address" };
type MaxArgument = { type: "max" };
type RegisterArgument = { type: "register" };
type PortArgument = { type: "port" };

type Instruction = {
  name: string;
  argument_count: number;
  argument_types: Argument[];
};

function instr(name: string, args: Argument[]): Instruction {
  return { name, argument_count: args.length, argument_types: args };
}

export const InstructionSet: { [key: number]: Instruction } = {
  0b1: instr("add", [{ type: "register" }, { type: "register" }, { type: "register" }]),
  0b10: instr("add", [{ type: "register" }, { type: "register" }, { type: "word" }]),
  0b11: instr("add", [{ type: "register" }, { type: "word" }, { type: "word" }]),

  0b100: instr("rsh", [{ type: "register" }, { type: "register" }]),
  0b101: instr("rsh", [{ type: "register" }, { type: "word" }]),

  0b110: instr("lodw", [{ type: "register" }, { type: "word" }]),
  0b111: instr("lodw", [{ type: "register" }, { type: "register" }]),

  0b1000: instr("strw", [{ type: "register" }, { type: "register" }]),
  0b1001: instr("strw", [{ type: "register" }, { type: "word" }]),
  0b1010: instr("strw", [{ type: "address" }, { type: "register" }]),
  0b1011: instr("strw", [{ type: "address" }, { type: "word" }]),

  0b1100: instr("bge", [{ type: "register" }, { type: "register" }, { type: "register" }]),
  0b1101: instr("bge", [{ type: "register" }, { type: "register" }, { type: "word" }]),
  0b1110: instr("bge", [{ type: "register" }, { type: "word" }, { type: "register" }]),
  0b1111: instr("bge", [{ type: "register" }, { type: "word" }, { type: "word" }]),
  0b10000: instr("bge", [{ type: "address" }, { type: "register" }, { type: "register" }]),
  0b10001: instr("bge", [{ type: "address" }, { type: "register" }, { type: "word" }]),
  0b10010: instr("bge", [{ type: "address" }, { type: "word" }, { type: "register" }]),
  0b10011: instr("bge", [{ type: "address" }, { type: "word" }, { type: "word" }]),

  0b10100: instr("nor", [{ type: "register" }, { type: "register" }, { type: "register" }]),
  0b10101: instr("nor", [{ type: "register" }, { type: "register" }, { type: "word" }]),
  0b10110: instr("nor", [{ type: "register" }, { type: "word" }, { type: "word" }]),

  0b10111: instr("sub", [{ type: "register" }, { type: "register" }, { type: "register" }]),
  0b11000: instr("sub", [{ type: "register" }, { type: "word" }, { type: "register" }]),
  0b11001: instr("sub", [{ type: "register" }, { type: "register" }, { type: "word" }]),
  0b11010: instr("sub", [{ type: "register" }, { type: "word" }, { type: "word" }]),

  0b11011: instr("jmp", [{ type: "register" }]),
  0b11100: instr("jmp", [{ type: "address" }]),

  0b11101: instr("mov", [{ type: "register" }, { type: "register" }]),

  0b11110: instr("nop", []),

  0b11111: instr("imm", [{ type: "register" }, { type: "word" }]),

  0b100000: instr("neg", [{ type: "register" }, { type: "register" }]),
  0b100001: instr("neg", [{ type: "register" }, { type: "word" }]),

  0b100010: instr("and", [{ type: "register" }, { type: "register" }, { type: "register" }]),
  0b100011: instr("and", [{ type: "register" }, { type: "register" }, { type: "word" }]),
  0b100100: instr("and", [{ type: "register" }, { type: "word" }, { type: "word" }]),

  0b100101: instr("or", [{ type: "register" }, { type: "register" }, { type: "register" }]),
  0b100110: instr("or", [{ type: "register" }, { type: "register" }, { type: "word" }]),
  0b100111: instr("or", [{ type: "register" }, { type: "word" }, { type: "word" }]),

  0b101000: instr("not", [{ type: "register" }, { type: "register" }]),
  0b101001: instr("not", [{ type: "register" }, { type: "word" }]),

  0b101010: instr("xnor", [{ type: "register" }, { type: "register" }, { type: "register" }]),
  0b101011: instr("xnor", [{ type: "register" }, { type: "register" }, { type: "word" }]),
  0b101100: instr("xnor", [{ type: "register" }, { type: "word" }, { type: "word" }]),

  0b101101: instr("xor", [{ type: "register" }, { type: "register" }, { type: "register" }]),
  0b101110: instr("xor", [{ type: "register" }, { type: "register" }, { type: "word" }]),
  0b101111: instr("xor", [{ type: "register" }, { type: "word" }, { type: "word" }]),

  0b110000: instr("nand", [{ type: "register" }, { type: "register" }, { type: "register" }]),
  0b110001: instr("nand", [{ type: "register" }, { type: "register" }, { type: "word" }]),
  0b110010: instr("nand", [{ type: "register" }, { type: "word" }, { type: "word" }]),

  0b110011: instr("brl", [{ type: "register" }, { type: "register" }, { type: "register" }]),
  0b110100: instr("brl", [{ type: "register" }, { type: "register" }, { type: "word" }]),
  0b110101: instr("brl", [{ type: "register" }, { type: "word" }, { type: "register" }]),
  0b110110: instr("brl", [{ type: "address" }, { type: "register" }, { type: "register" }]),
  0b110111: instr("brl", [{ type: "address" }, { type: "register" }, { type: "word" }]),
  0b111000: instr("brl", [{ type: "address" }, { type: "word" }, { type: "register" }]),

  0b111001: instr("brg", [{ type: "register" }, { type: "register" }, { type: "register" }]),
  0b111010: instr("brg", [{ type: "register" }, { type: "register" }, { type: "word" }]),
  0b111011: instr("brg", [{ type: "register" }, { type: "word" }, { type: "register" }]),
  0b111100: instr("brg", [{ type: "address" }, { type: "register" }, { type: "register" }]),
  0b111101: instr("brg", [{ type: "address" }, { type: "register" }, { type: "word" }]),
  0b111110: instr("brg", [{ type: "address" }, { type: "word" }, { type: "register" }]),

  0b111111: instr("bre", [{ type: "register" }, { type: "register" }, { type: "register" }]),
  0b1000000: instr("bre", [{ type: "register" }, { type: "register" }, { type: "word" }]),
  0b1000001: instr("bre", [{ type: "address" }, { type: "register" }, { type: "register" }]),
  0b1000010: instr("bre", [{ type: "address" }, { type: "register" }, { type: "word" }]),

  0b1000011: instr("bne", [{ type: "register" }, { type: "register" }, { type: "register" }]),
  0b1000100: instr("bne", [{ type: "register" }, { type: "register" }, { type: "word" }]),
  0b1000101: instr("bne", [{ type: "address" }, { type: "register" }, { type: "register" }]),
  0b1000110: instr("bne", [{ type: "address" }, { type: "register" }, { type: "word" }]),

  0b1000111: instr("bod", [{ type: "address" }, { type: "register" }]),
  0b1001000: instr("bod", [{ type: "register" }, { type: "register" }]),

  0b1001001: instr("bev", [{ type: "address" }, { type: "register" }]),
  0b1001010: instr("bev", [{ type: "register" }, { type: "register" }]),

  0b1001011: instr("ble", [{ type: "register" }, { type: "register" }, { type: "register" }]),
  0b1001100: instr("ble", [{ type: "register" }, { type: "register" }, { type: "word" }]),
  0b1001101: instr("ble", [{ type: "register" }, { type: "word" }, { type: "register" }]),
  0b1001110: instr("ble", [{ type: "address" }, { type: "register" }, { type: "register" }]),
  0b1001111: instr("ble", [{ type: "address" }, { type: "register" }, { type: "word" }]),
  0b1010000: instr("ble", [{ type: "address" }, { type: "word" }, { type: "register" }]),

  0b1010001: instr("brz", [{ type: "address" }, { type: "register" }]),
  0b1010010: instr("brz", [{ type: "register" }, { type: "register" }]),

  0b1010011: instr("bnz", [{ type: "address" }, { type: "register" }]),
  0b1010100: instr("bnz", [{ type: "register" }, { type: "register" }]),

  0b1010101: instr("brn", [{ type: "address" }, { type: "register" }]),
  0b1010110: instr("brn", [{ type: "register" }, { type: "register" }]),

  0b1010111: instr("brp", [{ type: "address" }, { type: "register" }]),
  0b1011000: instr("brp", [{ type: "register" }, { type: "register" }]),

  0b1011001: instr("psh", [{ type: "register" }]),
  0b1011010: instr("psh", [{ type: "word" }]),

  0b1011011: instr("pop", [{ type: "register" }]),

  0b1011100: instr("cal", [{ type: "register" }]),
  0b1011101: instr("cal", [{ type: "address" }]),

  0b1011110: instr("ret", []),

  0b1011111: instr("hlt", []),

  0b1100000: instr("cpy", [{ type: "register" }, { type: "register" }]),
  0b1100001: instr("cpy", [{ type: "register" }, { type: "address" }]),
  0b1100010: instr("cpy", [{ type: "address" }, { type: "register" }]),
  0b1100011: instr("cpy", [{ type: "address" }, { type: "address" }]),

  0b1100100: instr("brc", [{ type: "register" }, { type: "register" }, { type: "register" }]),
  0b1100101: instr("brc", [{ type: "register" }, { type: "register" }, { type: "word" }]),
  0b1100110: instr("brc", [{ type: "address" }, { type: "register" }, { type: "register" }]),
  0b1100111: instr("brc", [{ type: "address" }, { type: "register" }, { type: "word" }]),

  0b1101000: instr("bnc", [{ type: "register" }, { type: "register" }, { type: "register" }]),
  0b1101001: instr("bnc", [{ type: "register" }, { type: "register" }, { type: "word" }]),
  0b1101010: instr("bnc", [{ type: "address" }, { type: "register" }, { type: "register" }]),
  0b1101011: instr("bnc", [{ type: "address" }, { type: "register" }, { type: "word" }]),

  0b1101100: instr("mlt", [{ type: "register" }, { type: "register" }, { type: "register" }]),
  0b1101101: instr("mlt", [{ type: "register" }, { type: "register" }, { type: "word" }]),

  0b1101110: instr("umlt", [{ type: "register" }, { type: "register" }, { type: "register" }]),
  0b1101111: instr("umlt", [{ type: "register" }, { type: "register" }, { type: "word" }]),

  0b1110000: instr("sumlt", [{ type: "register" }, { type: "register" }, { type: "register" }]),
  0b1110001: instr("sumlt", [{ type: "register" }, { type: "register" }, { type: "word" }]),

  0b1110010: instr("div", [{ type: "register" }, { type: "register" }, { type: "register" }]),
  0b1110011: instr("div", [{ type: "register" }, { type: "register" }, { type: "word" }]),
  0b1110100: instr("div", [{ type: "register" }, { type: "word" }, { type: "register" }]),

  0b1110101: instr("mod", [{ type: "register" }, { type: "register" }, { type: "register" }]),
  0b1110110: instr("mod", [{ type: "register" }, { type: "register" }, { type: "word" }]),
  0b1110111: instr("mod", [{ type: "register" }, { type: "word" }, { type: "register" }]),

  0b1111000: instr("bsr", [{ type: "register" }, { type: "register" }, { type: "register" }]),
  0b1111001: instr("bsr", [{ type: "register" }, { type: "register" }, { type: "word" }]),
  0b1111010: instr("bsr", [{ type: "register" }, { type: "word" }, { type: "register" }]),

  0b1111011: instr("bsl", [{ type: "register" }, { type: "register" }, { type: "register" }]),
  0b1111100: instr("bsl", [{ type: "register" }, { type: "register" }, { type: "word" }]),
  0b1111101: instr("bsl", [{ type: "register" }, { type: "word" }, { type: "register" }]),

  0b1111110: instr("srs", [{ type: "register" }, { type: "register" }]),
  0b1111111: instr("srs", [{ type: "register" }, { type: "word" }]),

  0b10000000: instr("bss", [{ type: "register" }, { type: "register" }]),
  0b10000001: instr("bss", [{ type: "register" }, { type: "word" }]),

  0b10000010: instr("sete", [{ type: "register" }, { type: "register" }, { type: "register" }]),
  0b10000011: instr("sete", [{ type: "register" }, { type: "register" }, { type: "word" }]),

  0b10000100: instr("setne", [{ type: "register" }, { type: "register" }, { type: "register" }]),
  0b10000101: instr("setne", [{ type: "register" }, { type: "register" }, { type: "word" }]),

  0b10000110: instr("setg", [{ type: "register" }, { type: "register" }, { type: "register" }]),
  0b10000111: instr("setg", [{ type: "register" }, { type: "register" }, { type: "word" }]),
  0b10001000: instr("setg", [{ type: "register" }, { type: "word" }, { type: "register" }]),

  0b10001001: instr("setl", [{ type: "register" }, { type: "register" }, { type: "register" }]),
  0b10001010: instr("setl", [{ type: "register" }, { type: "register" }, { type: "word" }]),
  0b10001011: instr("setl", [{ type: "register" }, { type: "word" }, { type: "register" }]),

  0b10001100: instr("setge", [{ type: "register" }, { type: "register" }, { type: "register" }]),
  0b10001101: instr("setge", [{ type: "register" }, { type: "register" }, { type: "word" }]),
  0b10001110: instr("setge", [{ type: "register" }, { type: "word" }, { type: "register" }]),

  0b10001111: instr("setle", [{ type: "register" }, { type: "register" }, { type: "register" }]),
  0b10010000: instr("setle", [{ type: "register" }, { type: "register" }, { type: "word" }]),
  0b10010001: instr("setle", [{ type: "register" }, { type: "word" }, { type: "register" }]),

  0b10010010: instr("setc", [{ type: "register" }, { type: "register" }, { type: "register" }]),
  0b10010011: instr("setc", [{ type: "register" }, { type: "register" }, { type: "word" }]),

  0b10010100: instr("setnc", [{ type: "register" }, { type: "register" }, { type: "register" }]),
  0b10010101: instr("setnc", [{ type: "register" }, { type: "register" }, { type: "word" }]),

  0b10010110: instr("llod", [{ type: "register" }, { type: "register" }, { type: "register" }]),
  0b10010111: instr("llod", [{ type: "register" }, { type: "register" }, { type: "word" }]),
  0b10011000: instr("llod", [{ type: "register" }, { type: "word" }, { type: "register" }]),
  0b10011001: instr("llod", [{ type: "register" }, { type: "word" }, { type: "word" }]),

  0b10011010: instr("lstr", [{ type: "register" }, { type: "register" }, { type: "register" }]),
  0b10011011: instr("lstr", [{ type: "register" }, { type: "register" }, { type: "word" }]),
  0b10011100: instr("lstr", [{ type: "register" }, { type: "word" }, { type: "register" }]),
  0b10011101: instr("lstr", [{ type: "register" }, { type: "word" }, { type: "word" }]),
  0b10011110: instr("lstr", [{ type: "address" }, { type: "register" }, { type: "register" }]),
  0b10011111: instr("lstr", [{ type: "address" }, { type: "register" }, { type: "word" }]),
  0b10100000: instr("lstr", [{ type: "address" }, { type: "word" }, { type: "register" }]),
  0b10100001: instr("lstr", [{ type: "address" }, { type: "word" }, { type: "word" }]),

  0b10100010: instr("sdiv", [{ type: "register" }, { type: "register" }, { type: "register" }]),
  0b10100011: instr("sdiv", [{ type: "register" }, { type: "register" }, { type: "word" }]),
  0b10100100: instr("sdiv", [{ type: "register" }, { type: "word" }, { type: "register" }]),

  0b10100101: instr("sbrl", [{ type: "register" }, { type: "register" }, { type: "register" }]),
  0b10100110: instr("sbrl", [{ type: "register" }, { type: "register" }, { type: "word" }]),
  0b10100111: instr("sbrl", [{ type: "register" }, { type: "word" }, { type: "register" }]),
  0b10101000: instr("sbrl", [{ type: "address" }, { type: "register" }, { type: "register" }]),
  0b10101001: instr("sbrl", [{ type: "address" }, { type: "register" }, { type: "word" }]),
  0b10101010: instr("sbrl", [{ type: "address" }, { type: "word" }, { type: "register" }]),

  0b10101011: instr("sbrg", [{ type: "register" }, { type: "register" }, { type: "register" }]),
  0b10101100: instr("sbrg", [{ type: "register" }, { type: "register" }, { type: "word" }]),
  0b10101101: instr("sbrg", [{ type: "register" }, { type: "word" }, { type: "register" }]),
  0b10101110: instr("sbrg", [{ type: "address" }, { type: "register" }, { type: "register" }]),
  0b10101111: instr("sbrg", [{ type: "address" }, { type: "register" }, { type: "word" }]),
  0b10110000: instr("sbrg", [{ type: "address" }, { type: "word" }, { type: "register" }]),

  0b10110001: instr("sble", [{ type: "register" }, { type: "register" }, { type: "register" }]),
  0b10110010: instr("sble", [{ type: "register" }, { type: "register" }, { type: "word" }]),
  0b10110011: instr("sble", [{ type: "register" }, { type: "word" }, { type: "register" }]),
  0b10110100: instr("sble", [{ type: "address" }, { type: "register" }, { type: "register" }]),
  0b10110101: instr("sble", [{ type: "address" }, { type: "register" }, { type: "word" }]),
  0b10110110: instr("sble", [{ type: "address" }, { type: "word" }, { type: "register" }]),

  0b10110111: instr("sbge", [{ type: "register" }, { type: "register" }, { type: "register" }]),
  0b10111000: instr("sbge", [{ type: "register" }, { type: "register" }, { type: "word" }]),
  0b10111001: instr("sbge", [{ type: "register" }, { type: "word" }, { type: "register" }]),
  0b10111010: instr("sbge", [{ type: "address" }, { type: "register" }, { type: "register" }]),
  0b10111011: instr("sbge", [{ type: "address" }, { type: "register" }, { type: "word" }]),
  0b10111100: instr("sbge", [{ type: "address" }, { type: "word" }, { type: "register" }]),

  0b10111101: instr("ssetl", [{ type: "register" }, { type: "register" }, { type: "register" }]),
  0b10111110: instr("ssetl", [{ type: "register" }, { type: "register" }, { type: "word" }]),
  0b10111111: instr("ssetl", [{ type: "register" }, { type: "word" }, { type: "register" }]),

  0b11000000: instr("ssetg", [{ type: "register" }, { type: "register" }, { type: "register" }]),
  0b11000001: instr("ssetg", [{ type: "register" }, { type: "register" }, { type: "word" }]),
  0b11000010: instr("ssetg", [{ type: "register" }, { type: "word" }, { type: "register" }]),

  0b11000011: instr("ssetle", [{ type: "register" }, { type: "register" }, { type: "register" }]),
  0b11000100: instr("ssetle", [{ type: "register" }, { type: "register" }, { type: "word" }]),
  0b11000101: instr("ssetle", [{ type: "register" }, { type: "word" }, { type: "register" }]),

  0b11000110: instr("ssetge", [{ type: "register" }, { type: "register" }, { type: "register" }]),
  0b11000111: instr("ssetge", [{ type: "register" }, { type: "register" }, { type: "word" }]),
  0b11001000: instr("ssetge", [{ type: "register" }, { type: "word" }, { type: "register" }]),

  0b11001001: instr("abs", [{ type: "register" }, { type: "register" }]),
  0b11001010: instr("abs", [{ type: "register" }, { type: "word" }]),

  0b11001011: instr("in", [{ type: "register" }, { type: "port" }]),

  0b11001100: instr("out", [{ type: "port" }, { type: "register" }]),
  0b11001101: instr("out", [{ type: "port" }, { type: "word" }]),

  0b11001110: instr("adda", [{ type: "register" }, { type: "address" }, { type: "word" }]),
  0b11001111: instr("adda", [{ type: "register" }, { type: "register" }, { type: "word" }]),
  0b11010000: instr("adda", [{ type: "register" }, { type: "address" }, { type: "register" }]),
  0b11010001: instr("adda", [{ type: "register" }, { type: "register" }, { type: "register" }]),

  0b11010010: instr("addaa", [{ type: "register" }, { type: "address" }, { type: "address" }]),
  0b11010011: instr("addaa", [{ type: "register" }, { type: "register" }, { type: "address" }]),
  0b11010100: instr("addaa", [{ type: "register" }, { type: "address" }, { type: "register" }]),
  0b11010101: instr("addaa", [{ type: "register" }, { type: "register" }, { type: "register" }]),

  0b11010111: instr("suba", [{ type: "register" }, { type: "address" }, { type: "word" }]),
  0b11011000: instr("suba", [{ type: "register" }, { type: "register" }, { type: "word" }]),
  0b11011001: instr("suba", [{ type: "register" }, { type: "address" }, { type: "register" }]),
  0b11011010: instr("suba", [{ type: "register" }, { type: "register" }, { type: "register" }]),

  0b11011011: instr("subaa", [{ type: "register" }, { type: "address" }, { type: "address" }]),
  0b11011100: instr("subaa", [{ type: "register" }, { type: "register" }, { type: "address" }]),
  0b11011101: instr("subaa", [{ type: "register" }, { type: "address" }, { type: "register" }]),
  0b11011110: instr("subaa", [{ type: "register" }, { type: "register" }, { type: "register" }]),

  0b11011111: instr("extb", [{ type: "register" }, { type: "register" }]),

  0b11100000: instr("extw", [{ type: "register" }, { type: "register" }]),

  0b11100001: instr("mova", [{ type: "register" }, { type: "register" }]),
  0b11100010: instr("mova", [{ type: "register" }, { type: "word" }]),

  0b11100011: instr("movaa", [{ type: "register" }, { type: "register" }]),
  0b11100100: instr("movaa", [{ type: "register" }, { type: "address" }]),

  0b11100101: instr("psha", [{ type: "register" }]),
  0b11100110: instr("psha", [{ type: "address" }]),

  0b11100111: instr("popa", [{ type: "register" }]),

  0b11101000: instr("lodb", [{ type: "register" }, { type: "address" }]),
  0b11101001: instr("lodb", [{ type: "register" }, { type: "register" }]),

  0b11101010: instr("strb", [{ type: "address" }, { type: "word" }]),
  0b11101011: instr("strb", [{ type: "address" }, { type: "register" }]),
  0b11101100: instr("strb", [{ type: "register" }, { type: "word" }]),
  0b11101101: instr("strb", [{ type: "register" }, { type: "register" }]),

  0b11101110: instr("llodb", [{ type: "register" }, { type: "register" }, { type: "register" }]),
  0b11101111: instr("llodb", [{ type: "register" }, { type: "register" }, { type: "word" }]),
  0b11110000: instr("llodb", [{ type: "register" }, { type: "address" }, { type: "register" }]),
  0b11110001: instr("llodb", [{ type: "register" }, { type: "address" }, { type: "word" }]),

  0b11110010: instr("lstrb", [{ type: "register" }, { type: "register" }, { type: "register" }]),
  0b11110011: instr("lstrb", [{ type: "register" }, { type: "word" }, { type: "register" }]),
  0b11110100: instr("lstrb", [{ type: "address" }, { type: "register" }, { type: "register" }]),
  0b11110101: instr("lstrb", [{ type: "address" }, { type: "word" }, { type: "register" }]),
  0b11110110: instr("lstrb", [{ type: "register" }, { type: "register" }, { type: "word" }]),
  0b11110111: instr("lstrb", [{ type: "register" }, { type: "word" }, { type: "word" }]),
  0b11111000: instr("lstrb", [{ type: "address" }, { type: "register" }, { type: "word" }]),
  0b11111001: instr("lstrb", [{ type: "address" }, { type: "word" }, { type: "word" }]),

  0b11111010: instr("loda", [{ type: "register" }, { type: "address" }]),
  0b11111011: instr("loda", [{ type: "register" }, { type: "register" }]),

  0b11111100: instr("stra", [{ type: "address" }, { type: "address" }]),
  0b11111101: instr("stra", [{ type: "address" }, { type: "register" }]),
  0b11111110: instr("stra", [{ type: "register" }, { type: "address" }]),
  0b11111111: instr("stra", [{ type: "register" }, { type: "register" }]),

  0b100000000: instr("lloda", [{ type: "register" }, { type: "register" }, { type: "register" }]),
  0b100000001: instr("lloda", [{ type: "register" }, { type: "register" }, { type: "word" }]),
  0b100000010: instr("lloda", [{ type: "register" }, { type: "address" }, { type: "register" }]),
  0b100000011: instr("lloda", [{ type: "register" }, { type: "address" }, { type: "word" }]),

  0b100000100: instr("lstrb", [{ type: "register" }, { type: "register" }, { type: "register" }]),
  0b100000101: instr("lstrb", [{ type: "register" }, { type: "word" }, { type: "register" }]),
  0b100000110: instr("lstrb", [{ type: "address" }, { type: "register" }, { type: "register" }]),
  0b100000111: instr("lstrb", [{ type: "address" }, { type: "word" }, { type: "register" }]),
  0b100001000: instr("lstrb", [{ type: "register" }, { type: "register" }, { type: "address" }]),
  0b100001001: instr("lstrb", [{ type: "register" }, { type: "word" }, { type: "address" }]),
  0b100001010: instr("lstrb", [{ type: "address" }, { type: "register" }, { type: "address" }]),
  0b100001011: instr("lstrb", [{ type: "address" }, { type: "word" }, { type: "address" }]),

  0b100001100: instr("alignw", [{ type: "register" }, { type: "register" }]),
  0b100001101: instr("alignw", [{ type: "register" }, { type: "address" }]),

  0b100001110: instr("aligna", [{ type: "register" }, { type: "register" }]),
  0b100001111: instr("aligna", [{ type: "register" }, { type: "address" }]),

  0b100010000: instr("alignm", [{ type: "register" }, { type: "register" }]),
  0b100010001: instr("alignm", [{ type: "register" }, { type: "address" }]),
};
