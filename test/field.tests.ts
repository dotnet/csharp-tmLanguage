/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

import { should } from 'chai';
import { tokenize, Input, Token } from './utils/tokenize';

describe("Field", () => {
    before(() => { should(); });

    describe("Field", () => {
        it("declaration", async () => {
            const input = Input.InClass(`
int file;
private List _field;
private List field;
private List field123;`);

            const tokens = await tokenize(input);

            tokens.should.deep.equal([
                Token.PrimitiveType.Int,
                Token.Identifier.FieldName("file"),
                Token.Punctuation.Semicolon,

                Token.Keyword.Modifier.Private,
                Token.Type("List"),
                Token.Identifier.FieldName("_field"),
                Token.Punctuation.Semicolon,

                Token.Keyword.Modifier.Private,
                Token.Type("List"),
                Token.Identifier.FieldName("field"),
                Token.Punctuation.Semicolon,

                Token.Keyword.Modifier.Private,
                Token.Type("List"),
                Token.Identifier.FieldName("field123"),
                Token.Punctuation.Semicolon]);
        });

        it("generic", async () => {
            const input = Input.InClass(`private Dictionary< List<T>, Dictionary<T, D>> _field;`);
            const tokens = await tokenize(input);

            tokens.should.deep.equal([
                Token.Keyword.Modifier.Private,
                Token.Type("Dictionary"),
                Token.Punctuation.TypeParameter.Begin,
                Token.Type("List"),
                Token.Punctuation.TypeParameter.Begin,
                Token.Type("T"),
                Token.Punctuation.TypeParameter.End,
                Token.Punctuation.Comma,
                Token.Type("Dictionary"),
                Token.Punctuation.TypeParameter.Begin,
                Token.Type("T"),
                Token.Punctuation.Comma,
                Token.Type("D"),
                Token.Punctuation.TypeParameter.End,
                Token.Punctuation.TypeParameter.End,
                Token.Identifier.FieldName("_field"),
                Token.Punctuation.Semicolon]);
        });


        it("modifiers", async () => {
            const input = Input.InClass(`
private static readonly List _field;
readonly string _field2;
string _field3;
required int _field4;`);

            const tokens = await tokenize(input);

            tokens.should.deep.equal([
                Token.Keyword.Modifier.Private,
                Token.Keyword.Modifier.Static,
                Token.Keyword.Modifier.ReadOnly,
                Token.Type("List"),
                Token.Identifier.FieldName("_field"),
                Token.Punctuation.Semicolon,

                Token.Keyword.Modifier.ReadOnly,
                Token.PrimitiveType.String,
                Token.Identifier.FieldName("_field2"),
                Token.Punctuation.Semicolon,

                Token.PrimitiveType.String,
                Token.Identifier.FieldName("_field3"),
                Token.Punctuation.Semicolon,

                Token.Keyword.Modifier.Required,
                Token.PrimitiveType.Int,
                Token.Identifier.FieldName("_field4"),
                Token.Punctuation.Semicolon]);
        });

        it("types", async () => {
            const input = Input.InClass(`
string field123;
string[] field123;`);

            const tokens = await tokenize(input);

            tokens.should.deep.equal([
                Token.PrimitiveType.String,
                Token.Identifier.FieldName("field123"),
                Token.Punctuation.Semicolon,

                Token.PrimitiveType.String,
                Token.Punctuation.OpenBracket,
                Token.Punctuation.CloseBracket,
                Token.Identifier.FieldName("field123"),
                Token.Punctuation.Semicolon]);
        });

        it("assignment", async () => {
            const input = Input.InClass(`
private string field = "hello";
const   bool   field = true;`);

            let tokens = await tokenize(input);

            tokens.should.deep.equal([
                Token.Keyword.Modifier.Private,
                Token.PrimitiveType.String,
                Token.Identifier.FieldName("field"),
                Token.Operator.Assignment,
                Token.Punctuation.String.Begin,
                Token.Literal.String("hello"),
                Token.Punctuation.String.End,
                Token.Punctuation.Semicolon,

                Token.Keyword.Modifier.Const,
                Token.PrimitiveType.Bool,
                Token.Identifier.FieldName("field"),
                Token.Operator.Assignment,
                Token.Literal.Boolean.True,
                Token.Punctuation.Semicolon]);
        });

        it("declaration with multiple declarators", async () => {
            const input = Input.InClass(`int x = 19, y = 23, z = 42;`);
            const tokens = await tokenize(input);

            tokens.should.deep.equal([
                Token.PrimitiveType.Int,
                Token.Identifier.FieldName("x"),
                Token.Operator.Assignment,
                Token.Literal.Numeric.Decimal("19"),
                Token.Punctuation.Comma,
                Token.Identifier.FieldName("y"),
                Token.Operator.Assignment,
                Token.Literal.Numeric.Decimal("23"),
                Token.Punctuation.Comma,
                Token.Identifier.FieldName("z"),
                Token.Operator.Assignment,
                Token.Literal.Numeric.Decimal("42"),
                Token.Punctuation.Semicolon]);
        });

        it("tuple type with no names and no modifiers", async () => {
            const input = Input.InClass(`(int, int) x;`);
            const tokens = await tokenize(input);

            tokens.should.deep.equal([
                Token.Punctuation.OpenParen,
                Token.PrimitiveType.Int,
                Token.Punctuation.Comma,
                Token.PrimitiveType.Int,
                Token.Punctuation.CloseParen,
                Token.Identifier.FieldName("x"),
                Token.Punctuation.Semicolon]);
        });

        it("tuple type with no names and private modifier", async () => {
            const input = Input.InClass(`private (int, int) x;`);
            const tokens = await tokenize(input);

            tokens.should.deep.equal([
                Token.Keyword.Modifier.Private,
                Token.Punctuation.OpenParen,
                Token.PrimitiveType.Int,
                Token.Punctuation.Comma,
                Token.PrimitiveType.Int,
                Token.Punctuation.CloseParen,
                Token.Identifier.FieldName("x"),
                Token.Punctuation.Semicolon]);
        });

        it("tuple type with names and no modifiers", async () => {
            const input = Input.InClass(`(int x, int y) z;`);
            const tokens = await tokenize(input);

            tokens.should.deep.equal([
                Token.Punctuation.OpenParen,
                Token.PrimitiveType.Int,
                Token.Identifier.TupleElementName("x"),
                Token.Punctuation.Comma,
                Token.PrimitiveType.Int,
                Token.Identifier.TupleElementName("y"),
                Token.Punctuation.CloseParen,
                Token.Identifier.FieldName("z"),
                Token.Punctuation.Semicolon]);
        });

        it("tuple type with names and private modifier", async () => {
            const input = Input.InClass(`private (int x, int y) z;`);
            const tokens = await tokenize(input);

            tokens.should.deep.equal([
                Token.Keyword.Modifier.Private,
                Token.Punctuation.OpenParen,
                Token.PrimitiveType.Int,
                Token.Identifier.TupleElementName("x"),
                Token.Punctuation.Comma,
                Token.PrimitiveType.Int,
                Token.Identifier.TupleElementName("y"),
                Token.Punctuation.CloseParen,
                Token.Identifier.FieldName("z"),
                Token.Punctuation.Semicolon]);
        });

        it("Fields with fully-qualified names are highlighted properly (issue omnisharp-vscode#1097)", async () => {
            const input = Input.InClass(`
private CanvasGroup[] groups;
private UnityEngine.UI.Image[] selectedImages;
`);
            const tokens = await tokenize(input);

            tokens.should.deep.equal([
                Token.Keyword.Modifier.Private,
                Token.Type("CanvasGroup"),
                Token.Punctuation.OpenBracket,
                Token.Punctuation.CloseBracket,
                Token.Identifier.FieldName("groups"),
                Token.Punctuation.Semicolon,
                Token.Keyword.Modifier.Private,
                Token.Type("UnityEngine"),
                Token.Punctuation.Accessor,
                Token.Type("UI"),
                Token.Punctuation.Accessor,
                Token.Type("Image"),
                Token.Punctuation.OpenBracket,
                Token.Punctuation.CloseBracket,
                Token.Identifier.FieldName("selectedImages"),
                Token.Punctuation.Semicolon
            ]);
        });

        it("Fields with dictionary initializer highlights properly (issue omnisharp-vscode#1096)", async () => {
            const input = Input.InClass(`
private readonly Dictionary<string, int> languageToIndex = new Dictionary<string, int>()
{
    {"Simplified Chinese", 0},
    {"English", 1},
    {"Japanese", 2},
    {"Korean", 3}
};
`);
            const tokens = await tokenize(input);

            tokens.should.deep.equal([
                Token.Keyword.Modifier.Private,
                Token.Keyword.Modifier.ReadOnly,
                Token.Type("Dictionary"),
                Token.Punctuation.TypeParameter.Begin,
                Token.PrimitiveType.String,
                Token.Punctuation.Comma,
                Token.PrimitiveType.Int,
                Token.Punctuation.TypeParameter.End,
                Token.Identifier.FieldName("languageToIndex"),
                Token.Operator.Assignment,
                Token.Operator.Expression.New,
                Token.Type("Dictionary"),
                Token.Punctuation.TypeParameter.Begin,
                Token.PrimitiveType.String,
                Token.Punctuation.Comma,
                Token.PrimitiveType.Int,
                Token.Punctuation.TypeParameter.End,
                Token.Punctuation.OpenParen,
                Token.Punctuation.CloseParen,
                Token.Punctuation.OpenBrace,
                Token.Punctuation.OpenBrace,
                Token.Punctuation.String.Begin,
                Token.Literal.String("Simplified Chinese"),
                Token.Punctuation.String.End,
                Token.Punctuation.Comma,
                Token.Literal.Numeric.Decimal("0"),
                Token.Punctuation.CloseBrace,
                Token.Punctuation.Comma,
                Token.Punctuation.OpenBrace,
                Token.Punctuation.String.Begin,
                Token.Literal.String("English"),
                Token.Punctuation.String.End,
                Token.Punctuation.Comma,
                Token.Literal.Numeric.Decimal("1"),
                Token.Punctuation.CloseBrace,
                Token.Punctuation.Comma,
                Token.Punctuation.OpenBrace,
                Token.Punctuation.String.Begin,
                Token.Literal.String("Japanese"),
                Token.Punctuation.String.End,
                Token.Punctuation.Comma,
                Token.Literal.Numeric.Decimal("2"),
                Token.Punctuation.CloseBrace,
                Token.Punctuation.Comma,
                Token.Punctuation.OpenBrace,
                Token.Punctuation.String.Begin,
                Token.Literal.String("Korean"),
                Token.Punctuation.String.End,
                Token.Punctuation.Comma,
                Token.Literal.Numeric.Decimal("3"),
                Token.Punctuation.CloseBrace,
                Token.Punctuation.CloseBrace,
                Token.Punctuation.Semicolon
            ]);
        });

        it("initializer on multiple lines (issue omnisharp-vscode#316)", async () => {
            const input = Input.InClass(`
private readonly string initSportMessageFormatString = "line1"
    + "line2";`);

            let tokens = await tokenize(input);

            tokens.should.deep.equal([
                Token.Keyword.Modifier.Private,
                Token.Keyword.Modifier.ReadOnly,
                Token.PrimitiveType.String,
                Token.Identifier.FieldName("initSportMessageFormatString"),
                Token.Operator.Assignment,
                Token.Punctuation.String.Begin,
                Token.Literal.String("line1"),
                Token.Punctuation.String.End,
                Token.Operator.Arithmetic.Addition,
                Token.Punctuation.String.Begin,
                Token.Literal.String("line2"),
                Token.Punctuation.String.End,
                Token.Punctuation.Semicolon
            ]);
        });

        it("initializer containing lambda (issue #31)", async () => {
            const input = `
class C
{
    List<Action> f = new List<Action>
    {
        () => DoStuff()
    };

    public C(int x, int y) { }
}`;

            let tokens = await tokenize(input);

            tokens.should.deep.equal([
                Token.Keyword.Definition.Class,
                Token.Identifier.ClassName("C"),
                Token.Punctuation.OpenBrace,
                Token.Type("List"),
                Token.Punctuation.TypeParameter.Begin,
                Token.Type("Action"),
                Token.Punctuation.TypeParameter.End,
                Token.Identifier.FieldName("f"),
                Token.Operator.Assignment,
                Token.Operator.Expression.New,
                Token.Type("List"),
                Token.Punctuation.TypeParameter.Begin,
                Token.Type("Action"),
                Token.Punctuation.TypeParameter.End,
                Token.Punctuation.OpenBrace,
                Token.Punctuation.OpenParen,
                Token.Punctuation.CloseParen,
                Token.Operator.Arrow,
                Token.Identifier.MethodName("DoStuff"),
                Token.Punctuation.OpenParen,
                Token.Punctuation.CloseParen,
                Token.Punctuation.CloseBrace,
                Token.Punctuation.Semicolon,
                Token.Keyword.Modifier.Public,
                Token.Identifier.MethodName("C"),
                Token.Punctuation.OpenParen,
                Token.PrimitiveType.Int,
                Token.Identifier.ParameterName("x"),
                Token.Punctuation.Comma,
                Token.PrimitiveType.Int,
                Token.Identifier.ParameterName("y"),
                Token.Punctuation.CloseParen,
                Token.Punctuation.OpenBrace,
                Token.Punctuation.CloseBrace,
                Token.Punctuation.CloseBrace
            ]);
        });

        it("fixed-size buffer declaration", async () => {
            const input = Input.InStruct(`public fixed byte Buffer[30];`);
            const tokens = await tokenize(input);

            tokens.should.deep.equal([
                Token.Keyword.Modifier.Public,
                Token.Keyword.Modifier.Fixed,
                Token.PrimitiveType.Byte,
                Token.Identifier.FieldName("Buffer"),
                Token.Punctuation.OpenBracket,
                Token.Literal.Numeric.Decimal("30"),
                Token.Punctuation.CloseBracket,
                Token.Punctuation.Semicolon
            ]);
        });

        it("fixed-size buffer with unsafe modifier", async () => {
            const input = Input.InStruct(`public unsafe fixed byte Buffer[30];`);
            const tokens = await tokenize(input);

            tokens.should.deep.equal([
                Token.Keyword.Modifier.Public,
                Token.Keyword.Modifier.Unsafe,
                Token.Keyword.Modifier.Fixed,
                Token.PrimitiveType.Byte,
                Token.Identifier.FieldName("Buffer"),
                Token.Punctuation.OpenBracket,
                Token.Literal.Numeric.Decimal("30"),
                Token.Punctuation.CloseBracket,
                Token.Punctuation.Semicolon
            ]);
        });

        it("fixed-size buffer with const reference", async () => {
            const input = `
struct C
{
    public const int length = 30;
    public unsafe fixed byte Buffer[length];
}`;
            const tokens = await tokenize(input);

            tokens.should.deep.equal([
                Token.Keyword.Definition.Struct,
                Token.Identifier.StructName("C"),
                Token.Punctuation.OpenBrace,
                Token.Keyword.Modifier.Public,
                Token.Keyword.Modifier.Const,
                Token.PrimitiveType.Int,
                Token.Identifier.FieldName("length"),
                Token.Operator.Assignment,
                Token.Literal.Numeric.Decimal("30"),
                Token.Punctuation.Semicolon,
                Token.Keyword.Modifier.Public,
                Token.Keyword.Modifier.Unsafe,
                Token.Keyword.Modifier.Fixed,
                Token.PrimitiveType.Byte,
                Token.Identifier.FieldName("Buffer"),
                Token.Punctuation.OpenBracket,
                Token.Variable.ReadWrite("length"),
                Token.Punctuation.CloseBracket,
                Token.Punctuation.Semicolon,
                Token.Punctuation.CloseBrace
            ]);
        });
    });
});
