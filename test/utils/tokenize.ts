/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

import { Registry, StateStack, parseRawGrammar, } from 'vscode-textmate';
import * as oniguruma from 'vscode-oniguruma';
import * as fs from 'fs';
import * as path from 'path';

/**
 * Utility to read a file as a promise
 */
function readFile(path) {
    return new Promise<Buffer>((resolve, reject) => {
        fs.readFile(path, (error, data) => error ? reject(error) : resolve(data));
    })
}

// The path is different whether we are running tests from `out/test/**/*.js` or `test/**/*.ts`
var onigPath = fs.existsSync(path.join(__dirname, '../../node_modules/vscode-oniguruma/release/onig.wasm'))
    ? path.join(__dirname, '../../node_modules/vscode-oniguruma/release/onig.wasm')
    : path.join(__dirname, '../../../node_modules/vscode-oniguruma/release/onig.wasm');
const wasmBin = fs.readFileSync(onigPath).buffer;
const vscodeOnigurumaLib = oniguruma.loadWASM(wasmBin).then(() => {
    return {
        createOnigScanner(patterns) { return new oniguruma.OnigScanner(patterns); },
        createOnigString(s) { return new oniguruma.OnigString(s); }
    };
});

const registry = new Registry({
    onigLib: vscodeOnigurumaLib,
    loadGrammar: async (scopeName) => {
        if (scopeName === 'source.cs') {
            return readFile('./grammars/csharp.tmLanguage')
                .then(data => parseRawGrammar(data.toString()));
        }
        console.log(`Unknown scope name: ${scopeName}`);
        return null;
    }
});

function excludeType(type: string): boolean {
    return type === "source.cs" || type.startsWith("meta.");
}

export async function tokenize(input: string | Input, ...includeScopes: string[]): Promise<Token[]> {
    if (typeof input === "string") {
        input = Input.FromText(input);
    }

    let tokens: Token[] = [];
    let previousStack: StateStack = null;
    const grammar = await registry.loadGrammar('source.cs');

    for (let lineIndex = 0; lineIndex < input.lines.length; lineIndex++) {
        const line = input.lines[lineIndex];

        let lineResult = grammar.tokenizeLine(line, previousStack);
        previousStack = lineResult.ruleStack;

        if (lineIndex < input.span.startLine || lineIndex > input.span.endLine) {
            continue;
        }

        for (const token of lineResult.tokens) {
            if ((lineIndex === input.span.startLine && token.startIndex < input.span.startIndex) ||
                (lineIndex === input.span.endLine && token.endIndex > input.span.endIndex)) {
                continue;
            }

            const text = line.substring(token.startIndex, token.endIndex);
            const type = token.scopes[token.scopes.length - 1];

            if (!excludeType(type)) {
                if (includeScopes.length === 0) {
                    tokens.push(createToken(text, type));
                } else {
                    const scopes: string[] = [];
                    for (const scope of token.scopes.slice(0, -1)) {
                        if (includeScopes.some(prefix => scope.startsWith(prefix))) {
                            scopes.push(scope);
                        }
                    }
                    scopes.push(type);
                    tokens.push(createToken(text, scopes.join(" ")));
                }
            }
        }
    }

    return tokens;
}

interface Span {
    startLine: number;
    startIndex: number;
    endLine: number;
    endIndex: number;
}

export enum NamespaceStyle {
    BlockScoped,
    FileScoped
}

export class Input {
    private constructor(
        public lines: string[],
        public span: Span) { }

    public static FromText(text: string) {
        // ensure consistent line-endings irrelevant of OS
        text = text.replace('\r\n', '\n');
        let lines = text.split('\n');

        return new Input(lines, { startLine: 0, startIndex: 0, endLine: lines.length - 1, endIndex: lines[lines.length - 1].length });
    }

    public static InEnum(input: string) {
        let text = `
enum TestEnum {
    ${input}
}`;

        // ensure consistent line-endings irrelevant of OS
        text = text.replace('\r\n', '\n');
        let lines = text.split('\n');

        return new Input(lines, { startLine: 2, startIndex: 4, endLine: lines.length - 1, endIndex: 0 });
    }

    public static InClass(input: string) {
        let text = `
class TestClass {
    ${input}
}`;

        // ensure consistent line-endings irrelevant of OS
        text = text.replace('\r\n', '\n');
        let lines = text.split('\n');

        return new Input(lines, { startLine: 2, startIndex: 4, endLine: lines.length - 1, endIndex: 0 });
    }

    public static InInterface(input: string) {
        let text = `
interface TestInterface {
    ${input}
}`;

        // ensure consistent line-endings irrelevant of OS
        text = text.replace('\r\n', '\n');
        let lines = text.split('\n');

        return new Input(lines, { startLine: 2, startIndex: 4, endLine: lines.length - 1, endIndex: 0 });
    }

    public static InMethod(input: string) {
        let text = `
class TestClass {
    void TestMethod() {
        ${input}
    }
}`;

        // ensure consistent line-endings irrelevant of OS
        text = text.replace('\r\n', '\n');
        let lines = text.split('\n');

        return new Input(lines, { startLine: 3, startIndex: 8, endLine: lines.length - 2, endIndex: 0 });
    }

    public static InNamespace(input: string, style: NamespaceStyle) {
        let text = style == NamespaceStyle.FileScoped
            ? `
namespace TestNamespace;

${input}`
            : `
namespace TestNamespace {
    ${input}
}`;

        // ensure consistent line-endings irrelevant of OS
        text = text.replace('\r\n', '\n');
        let lines = text.split('\n');

        return style == NamespaceStyle.FileScoped
            ? new Input(lines, { startLine: 3, startIndex: 0, endLine: lines.length, endIndex: 0 })
            : new Input(lines, { startLine: 2, startIndex: 4, endLine: lines.length - 1, endIndex: 0 });
    }

    public static InStruct(input: string) {
        let text = `
struct TestStruct {
    ${input}
}`;

        // ensure consistent line-endings irrelevant of OS
        text = text.replace('\r\n', '\n');
        let lines = text.split('\n');

        return new Input(lines, { startLine: 2, startIndex: 4, endLine: lines.length - 1, endIndex: 0 });
    }
}

export interface Token {
    text: string;
    type: string;
}

function createToken(text: string, type: string): Token {
    return { text, type };
}

function createContext(scope: string) {
    return (...tokens: Token[]) => tokens.map(token => createToken(token.text, `${scope} ${token.type}`));
}

export namespace Token {
    export namespace Comment {
        export const LeadingWhitespace = (text: string) => createToken(text, 'punctuation.whitespace.comment.leading.cs');

        export namespace MultiLine {
            export const End = createToken('*/', 'punctuation.definition.comment.cs');
            export const Start = createToken('/*', 'punctuation.definition.comment.cs');

            export const Text = (text: string) => createToken(text, 'comment.block.cs');
        }

        export namespace SingleLine {
            export const Start = createToken('//', 'punctuation.definition.comment.cs');

            export const Text = (text: string) => createToken(text, 'comment.line.double-slash.cs');
        }
    }

    export namespace Identifier {
        export const AliasName = (text: string) => createToken(text, 'entity.name.type.alias.cs');
        export const ClassName = (text: string) => createToken(text, 'entity.name.type.class.cs');
        export const DelegateName = (text: string) => createToken(text, 'entity.name.type.delegate.cs');
        export const EnumMemberName = (text: string) => createToken(text, 'entity.name.variable.enum-member.cs');
        export const EnumName = (text: string) => createToken(text, 'entity.name.type.enum.cs');
        export const EventName = (text: string) => createToken(text, 'entity.name.variable.event.cs');
        export const FieldName = (text: string) => createToken(text, 'entity.name.variable.field.cs');
        export const InterfaceName = (text: string) => createToken(text, 'entity.name.type.interface.cs');
        export const LabelName = (text: string) => createToken(text, 'entity.name.label.cs');
        export const LocalName = (text: string) => createToken(text, 'entity.name.variable.local.cs');
        export const MethodName = (text: string) => createToken(text, 'entity.name.function.cs');
        export const NamespaceName = (text: string) => createToken(text, 'entity.name.type.namespace.cs');
        export const ParameterName = (text: string) => createToken(text, 'entity.name.variable.parameter.cs');
        export const PreprocessorSymbol = (text: string) => createToken(text, 'entity.name.variable.preprocessor.symbol.cs');
        export const PropertyName = (text: string) => createToken(text, 'entity.name.variable.property.cs');
        export const RangeVariableName = (text: string) => createToken(text, 'entity.name.variable.range-variable.cs');
        export const StructName = (text: string) => createToken(text, 'entity.name.type.struct.cs');
        export const TupleElementName = (text: string) => createToken(text, 'entity.name.variable.tuple-element.cs');
        export const TypeParameterName = (text: string) => createToken(text, 'entity.name.type.type-parameter.cs');
    }

    export namespace Keyword {
        export namespace Conditional {
            export const Case = createToken('case', 'keyword.control.conditional.case.cs');
            export const Default = createToken('default', 'keyword.control.conditional.default.cs');
            export const Else = createToken('else', 'keyword.control.conditional.else.cs');
            export const If = createToken('if', 'keyword.control.conditional.if.cs');
            export const Switch = createToken('switch', 'keyword.control.conditional.switch.cs');
            export const When = createToken('when', 'keyword.control.conditional.when.cs');
        }

        export namespace Constraint {
            export const Default = createToken('default', 'keyword.other.constraint.default.cs');
            export const NotNull = createToken('notnull', 'keyword.other.constraint.notnull.cs');
            export const Unmanaged = createToken('unmanaged', 'keyword.other.constraint.unmanaged.cs');
        }

        export namespace Context {
            export const Checked = createToken('checked', 'keyword.control.context.checked.cs');
            export const Fixed = createToken('fixed', 'keyword.control.context.fixed.cs');
            export const Lock = createToken('lock', 'keyword.control.context.lock.cs');
            export const Unchecked = createToken('unchecked', 'keyword.control.context.unchecked.cs');
            export const Unsafe = createToken('unsafe', 'keyword.control.context.unsafe.cs');
            export const Using = createToken('using', 'keyword.control.context.using.cs');
        }

        export namespace Definition {
            export const Add = createToken('add', 'storage.type.accessor.add.cs');
            export const Class = createToken('class', 'storage.type.class.cs');
            export const Delegate = createToken('delegate', 'storage.type.delegate.cs');
            export const Enum = createToken('enum', 'storage.type.enum.cs');
            export const Event = createToken('event', 'storage.type.event.cs');
            export const Get = createToken('get', 'storage.type.accessor.get.cs');
            export const Init = createToken('init', 'storage.type.accessor.init.cs');
            export const Interface = createToken('interface', 'storage.type.interface.cs');
            export const Namespace = createToken('namespace', 'storage.type.namespace.cs');
            export const Operator = createToken('operator', 'storage.type.operator.cs');
            export const Record = createToken('record', 'storage.type.record.cs');
            export const Remove = createToken('remove', 'storage.type.accessor.remove.cs');
            export const Set = createToken('set', 'storage.type.accessor.set.cs');
            export const Struct = createToken('struct', 'storage.type.struct.cs');
            export const Var = createToken('var', 'storage.type.var.cs');
        }

        export namespace Directive {
            export const Alias = createToken('alias', 'keyword.other.directive.alias.cs');
            export const Extern = createToken('extern', 'keyword.other.directive.extern.cs');
            export const Global = createToken('global', 'keyword.other.directive.global.cs');
            export const Static = createToken('static', 'keyword.other.directive.static.cs');
            export const Using = createToken('using', 'keyword.other.directive.using.cs');
        }

        export namespace Exception {
            export const Catch = createToken('catch', 'keyword.control.exception.catch.cs');
            export const Finally = createToken('finally', 'keyword.control.exception.finally.cs');
            export const Try = createToken('try', 'keyword.control.exception.try.cs');
            export const When = createToken('when', 'keyword.control.exception.when.cs');
        }

        export namespace Flow {
            export const Break = createToken('break', 'keyword.control.flow.break.cs');
            export const Continue = createToken('continue', 'keyword.control.flow.continue.cs');
            export const Goto = createToken('goto', 'keyword.control.flow.goto.cs');
            export const Return = createToken('return', 'keyword.control.flow.return.cs');
            export const Throw = createToken('throw', 'keyword.control.flow.throw.cs');
            export const Yield = createToken('yield', 'keyword.control.flow.yield.cs');
        }

        export namespace Loop {
            export const Do = createToken('do', 'keyword.control.loop.do.cs');
            export const For = createToken('for', 'keyword.control.loop.for.cs');
            export const ForEach = createToken('foreach', 'keyword.control.loop.foreach.cs');
            export const In = createToken('in', 'keyword.control.loop.in.cs');
            export const While = createToken('while', 'keyword.control.loop.while.cs');
        }

        export namespace Modifier {
            export const Abstract = createToken('abstract', 'storage.modifier.abstract.cs');
            export const Async = createToken('async', 'storage.modifier.async.cs');
            export const Const = createToken('const', 'storage.modifier.const.cs');
            export const Explicit = createToken('explicit', 'storage.modifier.explicit.cs');
            export const Extern = createToken('extern', 'storage.modifier.extern.cs');
            export const File = createToken('file', 'storage.modifier.file.cs');
            export const Implicit = createToken('implicit', 'storage.modifier.implicit.cs');
            export const In = createToken('in', 'storage.modifier.in.cs');
            export const Internal = createToken('internal', 'storage.modifier.internal.cs');
            export const New = createToken('new', 'storage.modifier.new.cs');
            export const Out = createToken('out', 'storage.modifier.out.cs');
            export const Override = createToken('override', 'storage.modifier.override.cs');
            export const Params = createToken('params', 'storage.modifier.params.cs');
            export const Partial = createToken('partial', 'storage.modifier.partial.cs');
            export const Private = createToken('private', 'storage.modifier.private.cs');
            export const Protected = createToken('protected', 'storage.modifier.protected.cs');
            export const Public = createToken('public', 'storage.modifier.public.cs');
            export const ReadOnly = createToken('readonly', 'storage.modifier.readonly.cs');
            export const Ref = createToken('ref', 'storage.modifier.ref.cs');
            export const Required = createToken('required', 'storage.modifier.required.cs');
            export const Sealed = createToken('sealed', 'storage.modifier.sealed.cs');
            export const Static = createToken('static', 'storage.modifier.static.cs');
            export const This = createToken('this', 'storage.modifier.this.cs');
            export const Unsafe = createToken('unsafe', 'storage.modifier.unsafe.cs');
            export const Virtual = createToken('virtual', 'storage.modifier.virtual.cs');
            export const Where = createToken('where', 'storage.modifier.where.cs');
        }

        export namespace Preprocessor {
            export const Checksum = createToken('checksum', 'keyword.preprocessor.checksum.cs');
            export const Default = createToken('default', 'keyword.preprocessor.default.cs');
            export const Define = createToken('define', 'keyword.preprocessor.define.cs');
            export const Disable = createToken('disable', 'keyword.preprocessor.disable.cs');
            export const ElIf = createToken('elif', 'keyword.preprocessor.elif.cs');
            export const Else = createToken('else', 'keyword.preprocessor.else.cs');
            export const EndIf = createToken('endif', 'keyword.preprocessor.endif.cs');
            export const EndRegion = createToken('endregion', 'keyword.preprocessor.endregion.cs');
            export const Error = createToken('error', 'keyword.preprocessor.error.cs');
            export const Hidden = createToken('hidden', 'keyword.preprocessor.hidden.cs');
            export const If = createToken('if', 'keyword.preprocessor.if.cs');
            export const Line = createToken('line', 'keyword.preprocessor.line.cs');
            export const Pragma = createToken('pragma', 'keyword.preprocessor.pragma.cs');
            export const Region = createToken('region', 'keyword.preprocessor.region.cs');
            export const Restore = createToken('restore', 'keyword.preprocessor.restore.cs');
            export const Undef = createToken('undef', 'keyword.preprocessor.undef.cs');
            export const Warning = createToken('warning', 'keyword.preprocessor.warning.cs');
            export const R = createToken('r', 'keyword.preprocessor.r.cs');
            export const Load = createToken('load', 'keyword.preprocessor.load.cs');
        }

        export const AttributeSpecifier = (text: string) => createToken(text, 'keyword.other.attribute-specifier.cs');
    }

    export namespace Literal {
        export namespace Boolean {
            export const False = createToken('false', 'constant.language.boolean.false.cs');
            export const True = createToken('true', 'constant.language.boolean.true.cs');
        }

        export const Null = createToken('null', 'constant.language.null.cs');

        export namespace Numeric {
            export const Binary = (text: string) => createToken(text, 'constant.numeric.binary.cs');
            export const Decimal = (text: string) => createToken(text, 'constant.numeric.decimal.cs');
            export const Hexadecimal = (text: string) => createToken(text, 'constant.numeric.hex.cs');
            export const Invalid = (text: string) => createToken(text, 'invalid.illegal.constant.numeric.cs')

            export namespace Other {
                export const Exponent = (text: string) => createToken(text, 'constant.numeric.other.exponent.cs');
                export const Suffix = (text: string) => createToken(text, 'constant.numeric.other.suffix.cs');

                export namespace Prefix {
                    export const Binary = (text: string) => createToken(text, 'constant.numeric.other.preffix.binary.cs');
                    export const Hexadecimal = (text: string) => createToken(text, 'constant.numeric.other.preffix.hex.cs');
                }

                export namespace Separator {
                    export const Decimals = createToken('.', 'constant.numeric.other.separator.decimals.cs');
                    export const Thousands = createToken('_', 'constant.numeric.other.separator.thousands.cs');
                }
            }
        }

        export const Char = (text: string) => createToken(text, 'string.quoted.single.cs');
        export const CharacterEscape = (text: string) => createToken(text, 'constant.character.escape.cs');
        export const String = (text: string) => createToken(text, 'string.quoted.double.cs');
    }

    export namespace Operator {
        export namespace Arithmetic {
            export const Addition = createToken('+', 'keyword.operator.arithmetic.cs');
            export const Division = createToken('/', 'keyword.operator.arithmetic.cs');
            export const Multiplication = createToken('*', 'keyword.operator.arithmetic.cs');
            export const Remainder = createToken('%', 'keyword.operator.arithmetic.cs');
            export const Subtraction = createToken('-', 'keyword.operator.arithmetic.cs');
        }

        export namespace Bitwise {
            export const And = createToken('&', 'keyword.operator.bitwise.cs');
            export const BitwiseComplement = createToken('~', 'keyword.operator.bitwise.cs');
            export const ExclusiveOr = createToken('^', 'keyword.operator.bitwise.cs');
            export const Or = createToken('|', 'keyword.operator.bitwise.cs');
            export const ShiftLeft = createToken('<<', 'keyword.operator.bitwise.shift.cs');
            export const ShiftRight = createToken('>>', 'keyword.operator.bitwise.shift.cs');
            export const ShiftRightUnsigned = createToken('>>>', 'keyword.operator.bitwise.shift.cs');
        }

        export namespace CompoundAssignment {
            export namespace Arithmetic {
                export const Addition = createToken('+=', 'keyword.operator.assignment.compound.cs');
                export const Division = createToken('/=', 'keyword.operator.assignment.compound.cs');
                export const Multiplication = createToken('*=', 'keyword.operator.assignment.compound.cs');
                export const Remainder = createToken('%=', 'keyword.operator.assignment.compound.cs');
                export const Subtraction = createToken('-=', 'keyword.operator.assignment.compound.cs');
            }

            export namespace Bitwise {
                export const And = createToken('&=', 'keyword.operator.assignment.compound.bitwise.cs');
                export const ExclusiveOr = createToken('^=', 'keyword.operator.assignment.compound.bitwise.cs');
                export const Or = createToken('|=', 'keyword.operator.assignment.compound.bitwise.cs');
                export const ShiftLeft = createToken('<<=', 'keyword.operator.assignment.compound.bitwise.cs');
                export const ShiftRight = createToken('>>=', 'keyword.operator.assignment.compound.bitwise.cs');
                export const ShiftRightUnsigned = createToken('>>>=', 'keyword.operator.assignment.compound.bitwise.cs');
            }

            export const NullCoalescing = createToken('??=', 'keyword.operator.assignment.compound.cs');
        }

        export namespace Conditional {
            export const QuestionMark = createToken('?', 'keyword.operator.conditional.question-mark.cs');
            export const Colon = createToken(':', 'keyword.operator.conditional.colon.cs');
        }

        export namespace Expression {
            export const As = createToken('as', 'keyword.operator.expression.as.cs');
            export const Await = createToken('await', 'keyword.operator.expression.await.cs');
            export const Checked = createToken('checked', 'keyword.operator.expression.checked.cs');
            export const Default = createToken('default', 'keyword.operator.expression.default.cs');
            export const NameOf = createToken('nameof', 'keyword.operator.expression.nameof.cs');
            export const New = createToken('new', 'keyword.operator.expression.new.cs');
            export const StackAlloc = createToken('stackalloc', 'keyword.operator.expression.stackalloc.cs');
            export const SizeOf = createToken('sizeof', 'keyword.operator.expression.sizeof.cs');
            export const TypeOf = createToken('typeof', 'keyword.operator.expression.typeof.cs');
            export const Unchecked = createToken('unchecked', 'keyword.operator.expression.unchecked.cs');
            export const With = createToken('with', 'keyword.operator.expression.with.cs');
        }

        export namespace Logical {
            export const And = createToken('&&', 'keyword.operator.logical.cs');
            export const Not = createToken('!', 'keyword.operator.logical.cs');
            export const Or = createToken('||', 'keyword.operator.logical.cs');
        }

        export namespace Relational {
            export const Equals = createToken('==', 'keyword.operator.comparison.cs');
            export const NotEqual = createToken('!=', 'keyword.operator.comparison.cs');

            export const LessThan = createToken('<', 'keyword.operator.relational.cs');
            export const LessThanOrEqual = createToken('<=', 'keyword.operator.relational.cs');
            export const GreaterThan = createToken('>', 'keyword.operator.relational.cs');
            export const GreaterThanOrEqual = createToken('>=', 'keyword.operator.relational.cs');
        }

        export namespace Pattern {
            export const And = createToken('and', 'keyword.operator.expression.pattern.combinator.and.cs');
            export const Is = createToken('is', 'keyword.operator.expression.pattern.is.cs');
            export const Not = createToken('not', 'keyword.operator.expression.pattern.combinator.not.cs');
            export const Or = createToken('or', 'keyword.operator.expression.pattern.combinator.or.cs');
        }

        export namespace Query {
            export const Ascending = createToken('ascending', 'keyword.operator.expression.query.ascending.cs');
            export const By = createToken('by', 'keyword.operator.expression.query.by.cs');
            export const Descending = createToken('descending', 'keyword.operator.expression.query.descending.cs');
            export const Equals = createToken('equals', 'keyword.operator.expression.query.equals.cs');
            export const From = createToken('from', 'keyword.operator.expression.query.from.cs');
            export const Group = createToken('group', 'keyword.operator.expression.query.group.cs');
            export const In = createToken('in', 'keyword.operator.expression.query.in.cs');
            export const Into = createToken('into', 'keyword.operator.expression.query.into.cs');
            export const Join = createToken('join', 'keyword.operator.expression.query.join.cs');
            export const Let = createToken('let', 'keyword.operator.expression.query.let.cs');
            export const On = createToken('on', 'keyword.operator.expression.query.on.cs');
            export const OrderBy = createToken('orderby', 'keyword.operator.expression.query.orderby.cs');
            export const Select = createToken('select', 'keyword.operator.expression.query.select.cs');
            export const Where = createToken('where', 'keyword.operator.expression.query.where.cs');
        }

        export const Arrow = createToken('=>', 'keyword.operator.arrow.cs');
        export const Assignment = createToken('=', 'keyword.operator.assignment.cs');
        export const Decrement = createToken('--', 'keyword.operator.decrement.cs');
        export const Increment = createToken('++', 'keyword.operator.increment.cs');
        export const NullCoalescing = createToken('??', 'keyword.operator.null-coalescing.cs');
        export const NullConditional = createToken('?', 'keyword.operator.null-conditional.cs');
        export const Range = createToken("..", "keyword.operator.range.cs");
    }

    export namespace PrimitiveType {
        export const Bool = createToken('bool', 'keyword.type.bool.cs');
        export const Byte = createToken('byte', 'keyword.type.byte.cs');
        export const Char = createToken('char', 'keyword.type.char.cs');
        export const Decimal = createToken('decimal', 'keyword.type.decimal.cs');
        export const Double = createToken('double', 'keyword.type.double.cs');
        export const Float = createToken('float', 'keyword.type.float.cs');
        export const Int = createToken('int', 'keyword.type.int.cs');
        export const Long = createToken('long', 'keyword.type.long.cs');
        export const Nint = createToken('nint', 'keyword.type.nint.cs');
        export const Nuint = createToken('nuint', 'keyword.type.nuint.cs');
        export const Object = createToken('object', 'keyword.type.object.cs');
        export const SByte = createToken('sbyte', 'keyword.type.sbyte.cs');
        export const Short = createToken('short', 'keyword.type.short.cs');
        export const String = createToken('string', 'keyword.type.string.cs');
        export const UInt = createToken('uint', 'keyword.type.uint.cs');
        export const ULong = createToken('ulong', 'keyword.type.ulong.cs');
        export const UShort = createToken('ushort', 'keyword.type.ushort.cs');
        export const Void = createToken('void', 'keyword.type.void.cs');
        export const Dynamic = createToken('dynamic', 'keyword.type.dynamic.cs');
    }

    export namespace Punctuation {
        export namespace Char {
            export const Begin = createToken('\'', 'punctuation.definition.char.begin.cs');
            export const End = createToken('\'', 'punctuation.definition.char.end.cs');
        }

        export namespace Interpolation {
            export const Begin = createToken('{', 'punctuation.definition.interpolation.begin.cs');
            export const End = createToken('}', 'punctuation.definition.interpolation.end.cs');
            export function RawBegin(numQuotes: number) { return createToken('{'.repeat(numQuotes), 'punctuation.definition.interpolation.begin.cs'); }
            export function RawEnd(numQuotes: number) { return createToken('}'.repeat(numQuotes), 'punctuation.definition.interpolation.end.cs'); }
        }

        export namespace InterpolatedString {
            export const Begin = createToken('$"', 'punctuation.definition.string.begin.cs');
            export const End = createToken('"', 'punctuation.definition.string.end.cs');
            export const VerbatimBegin = createToken('$@"', 'punctuation.definition.string.begin.cs');
            export const VerbatimBeginReverse = createToken('@$"', 'punctuation.definition.string.begin.cs');
            export function RawStringBegin(numQuotes: number, numDollars: number) { return createToken('$'.repeat(numDollars) + '"'.repeat(numQuotes), 'punctuation.definition.string.begin.cs'); }
            export function RawStringEnd(numQuotes: number) { return createToken('"'.repeat(numQuotes), 'punctuation.definition.string.end.cs'); }
        }

        export namespace String {
            export const Begin = createToken('"', 'punctuation.definition.string.begin.cs');
            export const End = createToken('"', 'punctuation.definition.string.end.cs');
            export const VerbatimBegin = createToken('@"', 'punctuation.definition.string.begin.cs');
            export function RawStringBegin(numQuotes: number) { return createToken('"'.repeat(numQuotes), 'punctuation.definition.string.begin.cs'); }
            export function RawStringEnd(numQuotes: number) { return createToken('"'.repeat(numQuotes), 'punctuation.definition.string.end.cs'); }
        }

        export namespace TypeParameter {
            export const Begin = createToken('<', 'punctuation.definition.typeparameters.begin.cs');
            export const End = createToken('>', 'punctuation.definition.typeparameters.end.cs');
        }

        export const Accessor = createToken('.', 'punctuation.accessor.cs');
        export const AccessorPointer = createToken('->', 'punctuation.accessor.pointer.cs');
        export const Asterisk = createToken('*', 'punctuation.separator.asterisk.cs')
        export const CloseBrace = createToken('}', 'punctuation.curlybrace.close.cs');
        export const CloseBracket = createToken(']', 'punctuation.squarebracket.close.cs');
        export const CloseParen = createToken(')', 'punctuation.parenthesis.close.cs');
        export const Colon = createToken(':', 'punctuation.separator.colon.cs');
        export const ColonColon = createToken('::', 'punctuation.separator.coloncolon.cs');
        export const Comma = createToken(',', 'punctuation.separator.comma.cs');
        export const Hash = createToken('#', 'punctuation.separator.hash.cs')
        export const OpenBrace = createToken('{', 'punctuation.curlybrace.open.cs');
        export const OpenBracket = createToken('[', 'punctuation.squarebracket.open.cs');
        export const OpenParen = createToken('(', 'punctuation.parenthesis.open.cs');
        export const QuestionMark = createToken('?', 'punctuation.separator.question-mark.cs');
        export const Semicolon = createToken(';', 'punctuation.terminator.statement.cs');
        export const Tilde = createToken('~', 'punctuation.tilde.cs');
    }

    export namespace Variable {
        export const Alias = (text: string) => createToken(text, 'variable.other.alias.cs');
        export const Constant = (text: string) => createToken(text, 'variable.other.constant.cs');
        export const Object = (text: string) => createToken(text, 'variable.other.object.cs');
        export const Property = (text: string) => createToken(text, 'variable.other.object.property.cs');
        export const ReadWrite = (text: string) => createToken(text, 'variable.other.readwrite.cs');
        export const Base = createToken('base', 'variable.language.base.cs');
        export const Discard = createToken('_', 'variable.language.discard.cs');
        export const This = createToken('this', 'variable.language.this.cs');
        export const Value = createToken('value', 'variable.other.value.cs');
    }

    export namespace XmlDocComment {
        export namespace Attribute {
            export const Name = (text: string) => createToken(text, 'entity.other.attribute-name.localname.cs');
        }

        export namespace CData {
            export const Begin = createToken('<![CDATA[', 'punctuation.definition.string.begin.cs');
            export const End = createToken(']]>', 'punctuation.definition.string.end.cs');
            export const Text = (text: string) => createToken(text, 'string.unquoted.cdata.cs');
        }

        export namespace CharacterEntity {
            export const Begin = createToken('&', 'punctuation.definition.constant.cs');
            export const End = createToken(';', 'punctuation.definition.constant.cs');
            export const Text = (text: string) => createToken(text, 'constant.character.entity.cs');
        }

        export namespace Comment {
            export const Begin = createToken('<!--', 'punctuation.definition.comment.cs')
            export const End = createToken('-->', 'punctuation.definition.comment.cs')
            export const Text = (text: string) => createToken(text, 'comment.block.cs')
        }

        export namespace Tag {
            // punctuation
            export const StartTagBegin = createToken('<', 'punctuation.definition.tag.cs');
            export const StartTagEnd = createToken('>', 'punctuation.definition.tag.cs');
            export const EndTagBegin = createToken('</', 'punctuation.definition.tag.cs');
            export const EndTagEnd = createToken('>', 'punctuation.definition.tag.cs');
            export const EmptyTagBegin = createToken('<', 'punctuation.definition.tag.cs');
            export const EmptyTagEnd = createToken('/>', 'punctuation.definition.tag.cs');

            export const Name = (text: string) => createToken(text, 'entity.name.tag.localname.cs');
        }

        export namespace String {
            export namespace DoubleQuoted {
                export const Begin = createToken('"', 'punctuation.definition.string.begin.cs');
                export const End = createToken('"', 'punctuation.definition.string.end.cs');
                export const Text = (text: string) => createToken(text, 'string.quoted.double.cs');
            }

            export namespace SingleQuoted {
                export const Begin = createToken('\'', 'punctuation.definition.string.begin.cs');
                export const End = createToken('\'', 'punctuation.definition.string.end.cs');
                export const Text = (text: string) => createToken(text, 'string.quoted.single.cs');
            }
        }

        export const Begin = createToken('///', 'punctuation.definition.comment.cs');
        export const BeginDelim = createToken('/**', 'punctuation.definition.comment.cs');
        export const Colon = createToken(':', 'punctuation.separator.colon.cs');
        export const Delim = createToken('*', 'punctuation.definition.comment.cs');
        export const End = createToken('*/', 'punctuation.definition.comment.cs');
        export const Equals = createToken('=', 'punctuation.separator.equals.cs');
        export const Text = (text: string) => createToken(text, 'comment.block.documentation.cs');
    }

    export const IllegalNewLine = (text: string) => createToken(text, 'invalid.illegal.newline.cs');
    export const PreprocessorMessage = (text: string) => createToken(text, 'string.unquoted.preprocessor.message.cs');
    export const Type = (text: string) => createToken(text, 'entity.name.type.cs');
}

export namespace Scope {
    export namespace Accessor {
        export const Getter = createContext("meta.accessor.getter.cs");
        export const Setter = createContext("meta.accessor.setter.cs");
    }
}
