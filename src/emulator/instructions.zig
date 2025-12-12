pub const Instruction = struct {
    name: InCode,
    arguments: []const InstructionArgumentType
};

pub const InstructionArgumentType = enum {
    REGISTER, WORD, ADDRESS, PORT
};

pub const InCode = enum {
    ADD, RSH, LODW, STRW, BGE, NOR, SUB, JMP,
    MOV, NOP, IMM, NEG, AND, OR, NOT, XNOR,
    XOR, NAND, BRL, BRG, BRE, BNE, BOD, BEV,
    BLE, BRZ, BNZ, BRN, BRP, PSH, POP, CAL, RET,
    HLT, CPY, BRC, BNC, MLT, UMLT, SUMLT, DIV,
    MOD, BSR, BSL, SRS, BSS, SETE, SETNE, SETG,
    SETL, SETGE, SETLE, SETC, SETNC, LLODW, LSTRW,
    SDIV, SBRL, SBRG, SBLE, SBGE, SSETL, SSETG,
    SSETLE, SSETGE, ABS, IN, OUT, ADDA, ADDAA,
    SUBA, SUBAA, EXTB, EXTW, MOVA, MOVAA, PSHA,
    POPA, LODB, STRB, LLODB, LSTRB, LODA, STRA,
    LLODA, LSTRA, ALIGNW, ALIGNA, ALIGNM

};

pub const Instructions: []const Instruction = &[_]Instruction{
    Instruction{ .name = .ADD, .arguments=(&.{ InstructionArgumentType.REGISTER, InstructionArgumentType.REGISTER, InstructionArgumentType.REGISTER })},
    Instruction{ .name = .ADD, .arguments=&.{ .REGISTER, .REGISTER, .WORD }},
    Instruction{ .name = .ADD, .arguments=&.{ .REGISTER, .WORD, .WORD }},

    Instruction{ .name = .RSH, .arguments=&.{ .REGISTER, .REGISTER }},
    Instruction{ .name = .RSH, .arguments=&.{ .REGISTER, .WORD }},

    Instruction{ .name = .LODW, .arguments=&.{ .REGISTER, .REGISTER }},
    Instruction{ .name = .LODW, .arguments=&.{ .REGISTER, .ADDRESS }},

    Instruction{ .name = .STRW, .arguments=&.{ .REGISTER, .REGISTER }},
    Instruction{ .name = .STRW, .arguments=&.{ .REGISTER, .WORD }},
    Instruction{ .name = .STRW, .arguments=&.{ .ADDRESS, .REGISTER }},
    Instruction{ .name = .STRW, .arguments=&.{ .ADDRESS, .WORD }},

    Instruction{ .name = .BGE, .arguments=&.{ .REGISTER, .REGISTER, .REGISTER }},
    Instruction{ .name = .BGE, .arguments=&.{ .REGISTER, .REGISTER, .WORD }},
    Instruction{ .name = .BGE, .arguments=&.{ .REGISTER, .WORD, .REGISTER }},
    Instruction{ .name = .BGE, .arguments=&.{ .REGISTER, .WORD, .WORD }},
    Instruction{ .name = .BGE, .arguments=&.{ .ADDRESS, .REGISTER, .REGISTER }},
    Instruction{ .name = .BGE, .arguments=&.{ .ADDRESS, .REGISTER, .WORD }},
    Instruction{ .name = .BGE, .arguments=&.{ .ADDRESS, .WORD, .REGISTER }},
    Instruction{ .name = .BGE, .arguments=&.{ .ADDRESS, .WORD, .WORD }},

    Instruction{ .name = .NOR, .arguments=&.{ .REGISTER, .REGISTER, .REGISTER }},
    Instruction{ .name = .NOR, .arguments=&.{ .REGISTER, .REGISTER, .WORD }},
    Instruction{ .name = .NOR, .arguments=&.{ .REGISTER, .WORD, .WORD }},

    Instruction{ .name = .SUB, .arguments=&.{ .REGISTER, .REGISTER, .REGISTER }},
    Instruction{ .name = .SUB, .arguments=&.{ .REGISTER, .REGISTER, .WORD }},
    Instruction{ .name = .SUB, .arguments=&.{ .REGISTER, .WORD, .REGISTER }},
    Instruction{ .name = .SUB, .arguments=&.{ .REGISTER, .WORD, .WORD }},

    Instruction{ .name = .JMP, .arguments=&.{ .REGISTER }},
    Instruction{ .name = .JMP, .arguments=&.{ .ADDRESS }},

    Instruction{ .name = .MOV, .arguments=&.{ .REGISTER, .REGISTER }},
    Instruction{ .name = .MOV, .arguments=&.{ .REGISTER, .WORD }},

    Instruction{ .name = .NOP, .arguments=&.{}},

    Instruction{ .name = .IMM, .arguments=&.{ .REGISTER, .WORD }},

    Instruction{ .name = .NEG, .arguments=&.{ .REGISTER, .REGISTER }},
    Instruction{ .name = .NEG, .arguments=&.{ .REGISTER, .WORD }},

    Instruction{ .name = .AND, .arguments=&.{ .REGISTER, .REGISTER, .REGISTER }},
    Instruction{ .name = .AND, .arguments=&.{ .REGISTER, .REGISTER, .WORD }},
    Instruction{ .name = .AND, .arguments=&.{ .REGISTER, .WORD, .WORD }},

    Instruction{ .name = .OR, .arguments=&.{ .REGISTER, .REGISTER, .REGISTER }},
    Instruction{ .name = .OR, .arguments=&.{ .REGISTER, .REGISTER, .WORD }},
    Instruction{ .name = .OR, .arguments=&.{ .REGISTER, .WORD, .WORD }},

    Instruction{ .name = .NOT, .arguments=&.{ .REGISTER, .REGISTER }},
    Instruction{ .name = .NOT, .arguments=&.{ .REGISTER, .WORD }},

    Instruction{ .name = .XNOR, .arguments=&.{ .REGISTER, .REGISTER, .REGISTER }},
    Instruction{ .name = .XNOR, .arguments=&.{ .REGISTER, .REGISTER, .WORD }},
    Instruction{ .name = .XNOR, .arguments=&.{ .REGISTER, .WORD, .WORD }},

    Instruction{ .name = .XOR, .arguments=&.{ .REGISTER, .REGISTER, .REGISTER }},
    Instruction{ .name = .XOR, .arguments=&.{ .REGISTER, .REGISTER, .WORD }},
    Instruction{ .name = .XOR, .arguments=&.{ .REGISTER, .WORD, .WORD }},

    Instruction{ .name = .NAND, .arguments=&.{ .REGISTER, .REGISTER, .REGISTER }},
    Instruction{ .name = .NAND, .arguments=&.{ .REGISTER, .REGISTER, .WORD }},
    Instruction{ .name = .NAND, .arguments=&.{ .REGISTER, .WORD, .WORD }},

    Instruction{ .name = .BRL, .arguments=&.{ .REGISTER, .REGISTER, .REGISTER }},
    Instruction{ .name = .BRL, .arguments=&.{ .REGISTER, .REGISTER, .WORD }},
    Instruction{ .name = .BRL, .arguments=&.{ .REGISTER, .WORD, .REGISTER }},
    Instruction{ .name = .BRL, .arguments=&.{ .REGISTER, .WORD, .WORD }},
    Instruction{ .name = .BRL, .arguments=&.{ .ADDRESS, .REGISTER, .REGISTER }},
    Instruction{ .name = .BRL, .arguments=&.{ .ADDRESS, .REGISTER, .WORD }},
    Instruction{ .name = .BRL, .arguments=&.{ .ADDRESS, .WORD, .REGISTER }},
    Instruction{ .name = .BRL, .arguments=&.{ .ADDRESS, .WORD, .WORD }},

    Instruction{ .name = .BRG, .arguments=&.{ .REGISTER, .REGISTER, .REGISTER }},
    Instruction{ .name = .BRG, .arguments=&.{ .REGISTER, .REGISTER, .WORD }},
    Instruction{ .name = .BRG, .arguments=&.{ .REGISTER, .WORD, .REGISTER }},
    Instruction{ .name = .BRG, .arguments=&.{ .REGISTER, .WORD, .WORD }},
    Instruction{ .name = .BRG, .arguments=&.{ .ADDRESS, .REGISTER, .REGISTER }},
    Instruction{ .name = .BRG, .arguments=&.{ .ADDRESS, .REGISTER, .WORD }},
    Instruction{ .name = .BRG, .arguments=&.{ .ADDRESS, .WORD, .REGISTER }},
    Instruction{ .name = .BRG, .arguments=&.{ .ADDRESS, .WORD, .WORD }},

    Instruction{ .name = .BRE, .arguments=&.{ .REGISTER, .REGISTER, .REGISTER }},
    Instruction{ .name = .BRE, .arguments=&.{ .REGISTER, .REGISTER, .WORD }},
    Instruction{ .name = .BRE, .arguments=&.{ .REGISTER, .WORD, .WORD }},
    Instruction{ .name = .BRE, .arguments=&.{ .ADDRESS, .REGISTER, .REGISTER }},
    Instruction{ .name = .BRE, .arguments=&.{ .ADDRESS, .REGISTER, .WORD }},
    Instruction{ .name = .BRE, .arguments=&.{ .ADDRESS, .WORD, .WORD }},

    Instruction{ .name = .BNE, .arguments=&.{ .REGISTER, .REGISTER, .REGISTER }},
    Instruction{ .name = .BNE, .arguments=&.{ .REGISTER, .REGISTER, .WORD }},
    Instruction{ .name = .BNE, .arguments=&.{ .REGISTER, .WORD, .WORD }},
    Instruction{ .name = .BNE, .arguments=&.{ .ADDRESS, .REGISTER, .REGISTER }},
    Instruction{ .name = .BNE, .arguments=&.{ .ADDRESS, .REGISTER, .WORD }},
    Instruction{ .name = .BNE, .arguments=&.{ .ADDRESS, .WORD, .WORD }},

    Instruction{ .name = .BOD, .arguments=&.{ .REGISTER, .REGISTER }},
    Instruction{ .name = .BOD, .arguments=&.{ .ADDRESS, .REGISTER }},

    Instruction{ .name = .BEV, .arguments=&.{ .REGISTER, .REGISTER }},
    Instruction{ .name = .BEV, .arguments=&.{ .ADDRESS, .REGISTER }},

    Instruction{ .name = .BLE, .arguments=&.{ .REGISTER, .REGISTER, .REGISTER }},
    Instruction{ .name = .BLE, .arguments=&.{ .REGISTER, .REGISTER, .WORD }},
    Instruction{ .name = .BLE, .arguments=&.{ .REGISTER, .WORD, .REGISTER }},
    Instruction{ .name = .BLE, .arguments=&.{ .REGISTER, .WORD, .WORD }},
    Instruction{ .name = .BLE, .arguments=&.{ .ADDRESS, .REGISTER, .REGISTER }},
    Instruction{ .name = .BLE, .arguments=&.{ .ADDRESS, .REGISTER, .WORD }},
    Instruction{ .name = .BLE, .arguments=&.{ .ADDRESS, .WORD, .REGISTER }},
    Instruction{ .name = .BLE, .arguments=&.{ .ADDRESS, .WORD, .WORD }},
    
    Instruction{ .name = .BRZ, .arguments=&.{ .REGISTER, .REGISTER }},
    Instruction{ .name = .BRZ, .arguments=&.{ .ADDRESS, .REGISTER }},
    
    Instruction{ .name = .BNZ, .arguments=&.{ .REGISTER, .REGISTER }},
    Instruction{ .name = .BNZ, .arguments=&.{ .ADDRESS, .REGISTER }},

    Instruction{ .name = .BRN, .arguments=&.{ .REGISTER, .REGISTER }},
    Instruction{ .name = .BRN, .arguments=&.{ .ADDRESS, .REGISTER }},
    
    Instruction{ .name = .BRP, .arguments=&.{ .REGISTER, .REGISTER }},
    Instruction{ .name = .BRP, .arguments=&.{ .ADDRESS, .REGISTER }},

    Instruction{ .name = .PSH, .arguments=&.{ .REGISTER }},
    Instruction{ .name = .PSH, .arguments=&.{ .WORD }},

    Instruction{ .name = .POP, .arguments=&.{ .REGISTER }},

    Instruction{ .name = .CAL, .arguments=&.{ .REGISTER }},
    Instruction{ .name = .CAL, .arguments=&.{ .ADDRESS }},

    Instruction{ .name = .RET, .arguments=&.{}},

    Instruction{ .name = .HLT, .arguments=&.{}},

    Instruction{ .name = .CPY, .arguments=&.{ .REGISTER, .REGISTER }},
    Instruction{ .name = .CPY, .arguments=&.{ .REGISTER, .ADDRESS }},
    Instruction{ .name = .CPY, .arguments=&.{ .ADDRESS, .REGISTER }},
    Instruction{ .name = .CPY, .arguments=&.{ .ADDRESS, .ADDRESS }},

    Instruction{ .name = .BRC, .arguments=&.{ .REGISTER, .REGISTER, .REGISTER }},
    Instruction{ .name = .BRC, .arguments=&.{ .REGISTER, .REGISTER, .WORD }},
    Instruction{ .name = .BRC, .arguments=&.{ .REGISTER, .WORD, .WORD }},
    Instruction{ .name = .BRC, .arguments=&.{ .ADDRESS, .REGISTER, .REGISTER }},
    Instruction{ .name = .BRC, .arguments=&.{ .ADDRESS, .REGISTER, .WORD }},
    Instruction{ .name = .BRC, .arguments=&.{ .ADDRESS, .WORD, .WORD }},

    Instruction{ .name = .BNC, .arguments=&.{ .REGISTER, .REGISTER, .REGISTER }},
    Instruction{ .name = .BNC, .arguments=&.{ .REGISTER, .REGISTER, .WORD }},
    Instruction{ .name = .BNC, .arguments=&.{ .REGISTER, .WORD, .WORD }},
    Instruction{ .name = .BNC, .arguments=&.{ .ADDRESS, .REGISTER, .REGISTER }},
    Instruction{ .name = .BNC, .arguments=&.{ .ADDRESS, .REGISTER, .WORD }},
    Instruction{ .name = .BNC, .arguments=&.{ .ADDRESS, .WORD, .WORD }},

    Instruction{ .name = .MLT, .arguments=&.{ .REGISTER, .REGISTER, .REGISTER }},
    Instruction{ .name = .MLT, .arguments=&.{ .REGISTER, .REGISTER, .WORD }},
    Instruction{ .name = .MLT, .arguments=&.{ .REGISTER, .WORD, .WORD }},

    Instruction{ .name = .UMLT, .arguments=&.{ .REGISTER, .REGISTER, .REGISTER }},
    Instruction{ .name = .UMLT, .arguments=&.{ .REGISTER, .REGISTER, .WORD }},
    Instruction{ .name = .UMLT, .arguments=&.{ .REGISTER, .WORD, .WORD }},

    Instruction{ .name = .SUMLT, .arguments=&.{ .REGISTER, .REGISTER, .REGISTER }},
    Instruction{ .name = .SUMLT, .arguments=&.{ .REGISTER, .REGISTER, .WORD }},
    Instruction{ .name = .SUMLT, .arguments=&.{ .REGISTER, .WORD, .WORD }},

    Instruction{ .name = .DIV, .arguments=&.{ .REGISTER, .REGISTER, .REGISTER }},
    Instruction{ .name = .DIV, .arguments=&.{ .REGISTER, .REGISTER, .WORD }},
    Instruction{ .name = .DIV, .arguments=&.{ .REGISTER, .WORD, .REGISTER }},
    Instruction{ .name = .DIV, .arguments=&.{ .REGISTER, .WORD, .WORD }},

    Instruction{ .name = .MOD, .arguments=&.{ .REGISTER, .REGISTER, .REGISTER }},
    Instruction{ .name = .MOD, .arguments=&.{ .REGISTER, .REGISTER, .WORD }},
    Instruction{ .name = .MOD, .arguments=&.{ .REGISTER, .WORD, .REGISTER }},
    Instruction{ .name = .MOD, .arguments=&.{ .REGISTER, .WORD, .WORD }},

    Instruction{ .name = .BSR, .arguments=&.{ .REGISTER, .REGISTER, .REGISTER }},
    Instruction{ .name = .BSR, .arguments=&.{ .REGISTER, .WORD, .REGISTER }},
    Instruction{ .name = .BSR, .arguments=&.{ .REGISTER, .REGISTER, .WORD }},
    Instruction{ .name = .BSR, .arguments=&.{ .REGISTER, .WORD, .WORD }},

    Instruction{ .name = .BSL, .arguments=&.{ .REGISTER, .REGISTER, .REGISTER }},
    Instruction{ .name = .BSL, .arguments=&.{ .REGISTER, .WORD, .REGISTER }},
    Instruction{ .name = .BSL, .arguments=&.{ .REGISTER, .REGISTER, .WORD }},
    Instruction{ .name = .BSL, .arguments=&.{ .REGISTER, .WORD, .WORD }},

    Instruction{ .name = .SRS, .arguments=&.{ .REGISTER, .REGISTER }},
    Instruction{ .name = .SRS, .arguments=&.{ .REGISTER, .WORD }},

    Instruction{ .name = .BSS, .arguments=&.{ .REGISTER, .REGISTER }},
    Instruction{ .name = .BSS, .arguments=&.{ .REGISTER, .WORD }},

    Instruction{ .name = .SETE, .arguments=&.{ .REGISTER, .REGISTER, .REGISTER }},
    Instruction{ .name = .SETE, .arguments=&.{ .REGISTER, .REGISTER, .WORD }},
    Instruction{ .name = .SETE, .arguments=&.{ .REGISTER, .WORD, .WORD }},

    Instruction{ .name = .SETNE, .arguments=&.{ .REGISTER, .REGISTER, .REGISTER }},
    Instruction{ .name = .SETNE, .arguments=&.{ .REGISTER, .REGISTER, .WORD }},
    Instruction{ .name = .SETNE, .arguments=&.{ .REGISTER, .WORD, .WORD }},

    Instruction{ .name = .SETG, .arguments=&.{ .REGISTER, .REGISTER, .REGISTER }},
    Instruction{ .name = .SETG, .arguments=&.{ .REGISTER, .REGISTER, .WORD }},
    Instruction{ .name = .SETG, .arguments=&.{ .REGISTER, .WORD, .WORD }},

    Instruction{ .name = .SETL, .arguments=&.{ .REGISTER, .REGISTER, .REGISTER }},
    Instruction{ .name = .SETL, .arguments=&.{ .REGISTER, .REGISTER, .WORD }},
    Instruction{ .name = .SETL, .arguments=&.{ .REGISTER, .WORD, .WORD }},

    Instruction{ .name = .SETGE, .arguments=&.{ .REGISTER, .REGISTER, .REGISTER }},
    Instruction{ .name = .SETGE, .arguments=&.{ .REGISTER, .REGISTER, .WORD }},
    Instruction{ .name = .SETGE, .arguments=&.{ .REGISTER, .WORD, .WORD }},

    Instruction{ .name = .SETLE, .arguments=&.{ .REGISTER, .REGISTER, .REGISTER }},
    Instruction{ .name = .SETLE, .arguments=&.{ .REGISTER, .REGISTER, .WORD }},
    Instruction{ .name = .SETLE, .arguments=&.{ .REGISTER, .WORD, .WORD }},

    Instruction{ .name = .SETC, .arguments=&.{ .REGISTER, .REGISTER, .REGISTER }},
    Instruction{ .name = .SETC, .arguments=&.{ .REGISTER, .REGISTER, .WORD }},
    Instruction{ .name = .SETC, .arguments=&.{ .REGISTER, .WORD, .WORD }},

    Instruction{ .name = .SETNC, .arguments=&.{ .REGISTER, .REGISTER, .REGISTER }},
    Instruction{ .name = .SETNC, .arguments=&.{ .REGISTER, .REGISTER, .WORD }},
    Instruction{ .name = .SETNC, .arguments=&.{ .REGISTER, .WORD, .WORD }},

    Instruction{ .name = .LLODW, .arguments=&.{ .REGISTER, .REGISTER, .REGISTER }},
    Instruction{ .name = .LLODW, .arguments=&.{ .REGISTER, .REGISTER, .WORD }},
    Instruction{ .name = .LLODW, .arguments=&.{ .REGISTER, .ADDRESS, .REGISTER }},
    Instruction{ .name = .LLODW, .arguments=&.{ .REGISTER, .ADDRESS, .WORD }},

    Instruction{ .name = .LSTRW, .arguments=&.{ .REGISTER, .REGISTER, .REGISTER }},
    Instruction{ .name = .LSTRW, .arguments=&.{ .ADDRESS, .REGISTER, .REGISTER }},
    Instruction{ .name = .LSTRW, .arguments=&.{ .REGISTER, .WORD, .REGISTER }},
    Instruction{ .name = .LSTRW, .arguments=&.{ .ADDRESS, .REGISTER, .REGISTER }},
    Instruction{ .name = .LSTRW, .arguments=&.{ .REGISTER, .REGISTER, .WORD }},
    Instruction{ .name = .LSTRW, .arguments=&.{ .ADDRESS, .REGISTER, .WORD }},
    Instruction{ .name = .LSTRW, .arguments=&.{ .REGISTER, .WORD, .WORD }},
    Instruction{ .name = .LSTRW, .arguments=&.{ .ADDRESS, .REGISTER, .WORD }},

    Instruction{ .name = .SDIV, .arguments=&.{ .REGISTER, .REGISTER, .REGISTER }},
    Instruction{ .name = .SDIV, .arguments=&.{ .REGISTER, .WORD, .REGISTER }},
    Instruction{ .name = .SDIV, .arguments=&.{ .REGISTER, .REGISTER, .WORD }},
    Instruction{ .name = .SDIV, .arguments=&.{ .REGISTER, .WORD, .WORD }},

    Instruction{ .name = .SBRL, .arguments=&.{ .REGISTER, .REGISTER, .REGISTER }},
    Instruction{ .name = .SBRL, .arguments=&.{ .REGISTER, .REGISTER, .WORD }},
    Instruction{ .name = .SBRL, .arguments=&.{ .REGISTER, .WORD, .REGISTER }},
    Instruction{ .name = .SBRL, .arguments=&.{ .REGISTER, .WORD, .WORD }},
    Instruction{ .name = .SBRL, .arguments=&.{ .ADDRESS, .REGISTER, .REGISTER }},
    Instruction{ .name = .SBRL, .arguments=&.{ .ADDRESS, .REGISTER, .WORD }},
    Instruction{ .name = .SBRL, .arguments=&.{ .ADDRESS, .WORD, .REGISTER }},
    Instruction{ .name = .SBRL, .arguments=&.{ .ADDRESS, .WORD, .WORD }},

    Instruction{ .name = .SBRG, .arguments=&.{ .REGISTER, .REGISTER, .REGISTER }},
    Instruction{ .name = .SBRG, .arguments=&.{ .REGISTER, .REGISTER, .WORD }},
    Instruction{ .name = .SBRG, .arguments=&.{ .REGISTER, .WORD, .REGISTER }},
    Instruction{ .name = .SBRG, .arguments=&.{ .REGISTER, .WORD, .WORD }},
    Instruction{ .name = .SBRG, .arguments=&.{ .ADDRESS, .REGISTER, .REGISTER }},
    Instruction{ .name = .SBRG, .arguments=&.{ .ADDRESS, .REGISTER, .WORD }},
    Instruction{ .name = .SBRG, .arguments=&.{ .ADDRESS, .WORD, .REGISTER }},
    Instruction{ .name = .SBRG, .arguments=&.{ .ADDRESS, .WORD, .WORD }},

    Instruction{ .name = .SBLE, .arguments=&.{ .REGISTER, .REGISTER, .REGISTER }},
    Instruction{ .name = .SBLE, .arguments=&.{ .REGISTER, .REGISTER, .WORD }},
    Instruction{ .name = .SBLE, .arguments=&.{ .REGISTER, .WORD, .REGISTER }},
    Instruction{ .name = .SBLE, .arguments=&.{ .REGISTER, .WORD, .WORD }},
    Instruction{ .name = .SBLE, .arguments=&.{ .ADDRESS, .REGISTER, .REGISTER }},
    Instruction{ .name = .SBLE, .arguments=&.{ .ADDRESS, .REGISTER, .WORD }},
    Instruction{ .name = .SBLE, .arguments=&.{ .ADDRESS, .WORD, .REGISTER }},
    Instruction{ .name = .SBLE, .arguments=&.{ .ADDRESS, .WORD, .WORD }},

    Instruction{ .name = .SBGE, .arguments=&.{ .REGISTER, .REGISTER, .REGISTER }},
    Instruction{ .name = .SBGE, .arguments=&.{ .REGISTER, .REGISTER, .WORD }},
    Instruction{ .name = .SBGE, .arguments=&.{ .REGISTER, .WORD, .REGISTER }},
    Instruction{ .name = .SBGE, .arguments=&.{ .REGISTER, .WORD, .WORD }},
    Instruction{ .name = .SBGE, .arguments=&.{ .ADDRESS, .REGISTER, .REGISTER }},
    Instruction{ .name = .SBGE, .arguments=&.{ .ADDRESS, .REGISTER, .WORD }},
    Instruction{ .name = .SBGE, .arguments=&.{ .ADDRESS, .WORD, .REGISTER }},
    Instruction{ .name = .SBGE, .arguments=&.{ .ADDRESS, .WORD, .WORD }},

    Instruction{ .name = .SSETL, .arguments=&.{ .REGISTER, .REGISTER, .REGISTER }},
    Instruction{ .name = .SSETL, .arguments=&.{ .REGISTER, .REGISTER, .WORD }},
    Instruction{ .name = .SSETL, .arguments=&.{ .REGISTER, .WORD, .REGISTER }},
    Instruction{ .name = .SSETL, .arguments=&.{ .REGISTER, .WORD, .WORD }},

    Instruction{ .name = .SSETG, .arguments=&.{ .REGISTER, .REGISTER, .REGISTER }},
    Instruction{ .name = .SSETG, .arguments=&.{ .REGISTER, .REGISTER, .WORD }},
    Instruction{ .name = .SSETG, .arguments=&.{ .REGISTER, .WORD, .REGISTER }},
    Instruction{ .name = .SSETG, .arguments=&.{ .REGISTER, .WORD, .WORD }},

    Instruction{ .name = .SSETLE, .arguments=&.{ .REGISTER, .REGISTER, .REGISTER }},
    Instruction{ .name = .SSETLE, .arguments=&.{ .REGISTER, .REGISTER, .WORD }},
    Instruction{ .name = .SSETLE, .arguments=&.{ .REGISTER, .WORD, .REGISTER }},
    Instruction{ .name = .SSETLE, .arguments=&.{ .REGISTER, .WORD, .WORD }},

    Instruction{ .name = .SSETGE, .arguments=&.{ .REGISTER, .REGISTER, .REGISTER }},
    Instruction{ .name = .SSETGE, .arguments=&.{ .REGISTER, .REGISTER, .WORD }},
    Instruction{ .name = .SSETGE, .arguments=&.{ .REGISTER, .WORD, .REGISTER }},
    Instruction{ .name = .SSETGE, .arguments=&.{ .REGISTER, .WORD, .WORD }},

    Instruction{ .name = .ABS, .arguments=&.{ .REGISTER, .REGISTER }},
    Instruction{ .name = .ABS, .arguments=&.{ .REGISTER, .WORD }},

    Instruction{ .name = .IN, .arguments=&.{ .REGISTER, .PORT }},

    Instruction{ .name = .OUT, .arguments=&.{ .PORT, .REGISTER }},
    Instruction{ .name = .OUT, .arguments=&.{ .PORT, .WORD }},

    Instruction{ .name = .ADDA, .arguments=&.{ .REGISTER, .REGISTER, .REGISTER }},
    Instruction{ .name = .ADDA, .arguments=&.{ .REGISTER, .REGISTER, .WORD }},
    Instruction{ .name = .ADDA, .arguments=&.{ .REGISTER, .ADDRESS, .REGISTER }},
    Instruction{ .name = .ADDA, .arguments=&.{ .REGISTER, .ADDRESS, .WORD }},

    Instruction{ .name = .ADDAA, .arguments=&.{ .REGISTER, .REGISTER, .REGISTER }},
    Instruction{ .name = .ADDAA, .arguments=&.{ .REGISTER, .REGISTER, .ADDRESS }},
    Instruction{ .name = .ADDAA, .arguments=&.{ .REGISTER, .ADDRESS, .REGISTER }},
    Instruction{ .name = .ADDAA, .arguments=&.{ .REGISTER, .ADDRESS, .ADDRESS }},

    Instruction{ .name = .SUBA, .arguments=&.{ .REGISTER, .REGISTER, .REGISTER }},
    Instruction{ .name = .SUBA, .arguments=&.{ .REGISTER, .REGISTER, .WORD }},
    Instruction{ .name = .SUBA, .arguments=&.{ .REGISTER, .ADDRESS, .REGISTER }},
    Instruction{ .name = .SUBA, .arguments=&.{ .REGISTER, .ADDRESS, .WORD }},

    Instruction{ .name = .SUBAA, .arguments=&.{ .REGISTER, .REGISTER, .REGISTER }},
    Instruction{ .name = .SUBAA, .arguments=&.{ .REGISTER, .REGISTER, .ADDRESS }},
    Instruction{ .name = .SUBAA, .arguments=&.{ .REGISTER, .ADDRESS, .REGISTER }},
    Instruction{ .name = .SUBAA, .arguments=&.{ .REGISTER, .ADDRESS, .ADDRESS }},

    Instruction{ .name = .EXTB, .arguments=&.{ .REGISTER, .REGISTER }},
    Instruction{ .name = .EXTW, .arguments=&.{ .REGISTER, .REGISTER }},

    Instruction{ .name = .MOVA, .arguments=&.{ .REGISTER, .REGISTER }},
    Instruction{ .name = .MOVA, .arguments=&.{ .REGISTER, .WORD }},

    Instruction{ .name = .MOVAA, .arguments=&.{ .REGISTER, .REGISTER }},
    Instruction{ .name = .MOVAA, .arguments=&.{ .REGISTER, .ADDRESS }},

    Instruction{ .name = .PSHA, .arguments=&.{ .REGISTER }},
    Instruction{ .name = .PSHA, .arguments=&.{ .ADDRESS }},

    Instruction{ .name = .POPA, .arguments=&.{ .REGISTER }},

    Instruction{ .name = .LODB, .arguments=&.{ .REGISTER, .ADDRESS }},
    Instruction{ .name = .LODB, .arguments=&.{ .REGISTER, .REGISTER }},

    Instruction{ .name = .STRB, .arguments=&.{ .REGISTER, .REGISTER }},
    Instruction{ .name = .STRB, .arguments=&.{ .REGISTER, .WORD }},
    Instruction{ .name = .STRB, .arguments=&.{ .ADDRESS, .REGISTER }},
    Instruction{ .name = .STRB, .arguments=&.{ .ADDRESS, .WORD }},

    Instruction{ .name = .LLODB, .arguments=&.{ .REGISTER, .REGISTER, .REGISTER }},
    Instruction{ .name = .LLODB, .arguments=&.{ .REGISTER, .REGISTER, .WORD }},
    Instruction{ .name = .LLODB, .arguments=&.{ .REGISTER, .ADDRESS, .REGISTER }},
    Instruction{ .name = .LLODB, .arguments=&.{ .REGISTER, .ADDRESS, .WORD }},

    Instruction{ .name = .LSTRB, .arguments=&.{ .REGISTER, .REGISTER, .REGISTER }},
    Instruction{ .name = .LSTRB, .arguments=&.{ .ADDRESS, .REGISTER, .REGISTER }},
    Instruction{ .name = .LSTRB, .arguments=&.{ .REGISTER, .WORD, .REGISTER }},
    Instruction{ .name = .LSTRB, .arguments=&.{ .ADDRESS, .WORD, .REGISTER }},
    Instruction{ .name = .LSTRB, .arguments=&.{ .REGISTER, .REGISTER, .WORD }},
    Instruction{ .name = .LSTRB, .arguments=&.{ .ADDRESS, .REGISTER, .WORD }},
    Instruction{ .name = .LSTRB, .arguments=&.{ .REGISTER, .WORD, .WORD }},
    Instruction{ .name = .LSTRB, .arguments=&.{ .ADDRESS, .WORD, .WORD }},

    Instruction{ .name = .LODA, .arguments=&.{ .REGISTER, .ADDRESS }},
    Instruction{ .name = .LODA, .arguments=&.{ .REGISTER, .REGISTER }},

    Instruction{ .name = .STRA, .arguments=&.{ .REGISTER, .REGISTER }},
    Instruction{ .name = .STRA, .arguments=&.{ .REGISTER, .ADDRESS }},
    Instruction{ .name = .STRA, .arguments=&.{ .ADDRESS, .REGISTER }},
    Instruction{ .name = .STRA, .arguments=&.{ .ADDRESS, .ADDRESS }},

    Instruction{ .name = .LLODA, .arguments=&.{ .REGISTER, .REGISTER, .REGISTER }},
    Instruction{ .name = .LLODA, .arguments=&.{ .REGISTER, .REGISTER, .WORD }},
    Instruction{ .name = .LLODA, .arguments=&.{ .REGISTER, .ADDRESS, .REGISTER }},
    Instruction{ .name = .LLODA, .arguments=&.{ .REGISTER, .ADDRESS, .WORD }},

    Instruction{ .name = .LSTRA, .arguments=&.{ .REGISTER, .REGISTER, .REGISTER }},
    Instruction{ .name = .LSTRA, .arguments=&.{ .ADDRESS, .REGISTER, .REGISTER }},
    Instruction{ .name = .LSTRA, .arguments=&.{ .REGISTER, .WORD, .REGISTER }},
    Instruction{ .name = .LSTRA, .arguments=&.{ .ADDRESS, .WORD, .REGISTER }},
    Instruction{ .name = .LSTRA, .arguments=&.{ .REGISTER, .REGISTER, .ADDRESS }},
    Instruction{ .name = .LSTRA, .arguments=&.{ .ADDRESS, .REGISTER, .ADDRESS }},
    Instruction{ .name = .LSTRA, .arguments=&.{ .REGISTER, .WORD, .ADDRESS }},
    Instruction{ .name = .LSTRA, .arguments=&.{ .ADDRESS, .WORD, .ADDRESS }},

    Instruction{ .name = .ALIGNW, .arguments=&.{ .REGISTER, .REGISTER }},
    Instruction{ .name = .ALIGNW, .arguments=&.{ .REGISTER, .ADDRESS }},

    Instruction{ .name = .ALIGNA, .arguments=&.{ .REGISTER, .REGISTER }},
    Instruction{ .name = .ALIGNA, .arguments=&.{ .REGISTER, .ADDRESS }},

    Instruction{ .name = .ALIGNM, .arguments=&.{ .REGISTER, .REGISTER }},
    Instruction{ .name = .ALIGNM, .arguments=&.{ .REGISTER, .ADDRESS }},
};               
