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
private List _field;
private List field;
private List field123;`);

            const tokens = await tokenize(input);

            tokens.should.deep.equal([
                Token.Keywords.Modifiers.Private,
                Token.Type("List"),
                Token.Identifiers.FieldName("_field"),
                Token.Punctuation.Semicolon,

                Token.Keywords.Modifiers.Private,
                Token.Type("List"),
                Token.Identifiers.FieldName("field"),
                Token.Punctuation.Semicolon,

                Token.Keywords.Modifiers.Private,
                Token.Type("List"),
                Token.Identifiers.FieldName("field123"),
                Token.Punctuation.Semicolon]);
        });

        it("generic", async () => {
            const input = Input.InClass(`private Dictionary< List<T>, Dictionary<T, D>> _field;`);
            const tokens = await tokenize(input);

            tokens.should.deep.equal([
                Token.Keywords.Modifiers.Private,
                Token.Type("Dictionary"),
                Token.Punctuation.TypeParameters.Begin,
                Token.Type("List"),
                Token.Punctuation.TypeParameters.Begin,
                Token.Type("T"),
                Token.Punctuation.TypeParameters.End,
                Token.Punctuation.Comma,
                Token.Type("Dictionary"),
                Token.Punctuation.TypeParameters.Begin,
                Token.Type("T"),
                Token.Punctuation.Comma,
                Token.Type("D"),
                Token.Punctuation.TypeParameters.End,
                Token.Punctuation.TypeParameters.End,
                Token.Identifiers.FieldName("_field"),
                Token.Punctuation.Semicolon]);
        });


        it("modifiers", async () => {
            const input = Input.InClass(`
private static readonly List _field;
readonly string _field2;
string _field3;`);

            const tokens = await tokenize(input);

            tokens.should.deep.equal([
                Token.Keywords.Modifiers.Private,
                Token.Keywords.Modifiers.Static,
                Token.Keywords.Modifiers.ReadOnly,
                Token.Type("List"),
                Token.Identifiers.FieldName("_field"),
                Token.Punctuation.Semicolon,

                Token.Keywords.Modifiers.ReadOnly,
                Token.PrimitiveType.String,
                Token.Identifiers.FieldName("_field2"),
                Token.Punctuation.Semicolon,

                Token.PrimitiveType.String,
                Token.Identifiers.FieldName("_field3"),
                Token.Punctuation.Semicolon]);
        });

        it("types", async () => {
            const input = Input.InClass(`
string field123;
string[] field123;`);

            const tokens = await tokenize(input);

            tokens.should.deep.equal([
                Token.PrimitiveType.String,
                Token.Identifiers.FieldName("field123"),
                Token.Punctuation.Semicolon,

                Token.PrimitiveType.String,
                Token.Punctuation.OpenBracket,
                Token.Punctuation.CloseBracket,
                Token.Identifiers.FieldName("field123"),
                Token.Punctuation.Semicolon]);
        });

        it("assignment", async () => {
            const input = Input.InClass(`
private string field = "hello";
const   bool   field = true;`);

            let tokens = await tokenize(input);

            tokens.should.deep.equal([
                Token.Keywords.Modifiers.Private,
                Token.PrimitiveType.String,
                Token.Identifiers.FieldName("field"),
                Token.Operators.Assignment,
                Token.Punctuation.String.Begin,
                Token.Literals.String("hello"),
                Token.Punctuation.String.End,
                Token.Punctuation.Semicolon,

                Token.Keywords.Modifiers.Const,
                Token.PrimitiveType.Bool,
                Token.Identifiers.FieldName("field"),
                Token.Operators.Assignment,
                Token.Literals.Boolean.True,
                Token.Punctuation.Semicolon]);
        });

        it("declaration with multiple declarators", async () => {
            const input = Input.InClass(`int x = 19, y = 23, z = 42;`);
            const tokens = await tokenize(input);

            tokens.should.deep.equal([
                Token.PrimitiveType.Int,
                Token.Identifiers.FieldName("x"),
                Token.Operators.Assignment,
                Token.Literals.Numeric.Decimal("19"),
                Token.Punctuation.Comma,
                Token.Identifiers.FieldName("y"),
                Token.Operators.Assignment,
                Token.Literals.Numeric.Decimal("23"),
                Token.Punctuation.Comma,
                Token.Identifiers.FieldName("z"),
                Token.Operators.Assignment,
                Token.Literals.Numeric.Decimal("42"),
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
                Token.Identifiers.FieldName("x"),
                Token.Punctuation.Semicolon]);
        });

        it("tuple type with no names and private modifier", async () => {
            const input = Input.InClass(`private (int, int) x;`);
            const tokens = await tokenize(input);

            tokens.should.deep.equal([
                Token.Keywords.Modifiers.Private,
                Token.Punctuation.OpenParen,
                Token.PrimitiveType.Int,
                Token.Punctuation.Comma,
                Token.PrimitiveType.Int,
                Token.Punctuation.CloseParen,
                Token.Identifiers.FieldName("x"),
                Token.Punctuation.Semicolon]);
        });

        it("tuple type with names and no modifiers", async () => {
            const input = Input.InClass(`(int x, int y) z;`);
            const tokens = await tokenize(input);

            tokens.should.deep.equal([
                Token.Punctuation.OpenParen,
                Token.PrimitiveType.Int,
                Token.Identifiers.TupleElementName("x"),
                Token.Punctuation.Comma,
                Token.PrimitiveType.Int,
                Token.Identifiers.TupleElementName("y"),
                Token.Punctuation.CloseParen,
                Token.Identifiers.FieldName("z"),
                Token.Punctuation.Semicolon]);
        });

        it("tuple type with names and private modifier", async () => {
            const input = Input.InClass(`private (int x, int y) z;`);
            const tokens = await tokenize(input);

            tokens.should.deep.equal([
                Token.Keywords.Modifiers.Private,
                Token.Punctuation.OpenParen,
                Token.PrimitiveType.Int,
                Token.Identifiers.TupleElementName("x"),
                Token.Punctuation.Comma,
                Token.PrimitiveType.Int,
                Token.Identifiers.TupleElementName("y"),
                Token.Punctuation.CloseParen,
                Token.Identifiers.FieldName("z"),
                Token.Punctuation.Semicolon]);
        });

        it("Fields with fully-qualified names are highlighted properly (issue omnisharp-vscode#1097)", async () => {
            const input = Input.InClass(`
private CanvasGroup[] groups;
private UnityEngine.UI.Image[] selectedImages;
`);
            const tokens = await tokenize(input);

            tokens.should.deep.equal([
                Token.Keywords.Modifiers.Private,
                Token.Type("CanvasGroup"),
                Token.Punctuation.OpenBracket,
                Token.Punctuation.CloseBracket,
                Token.Identifiers.FieldName("groups"),
                Token.Punctuation.Semicolon,
                Token.Keywords.Modifiers.Private,
                Token.Type("UnityEngine"),
                Token.Punctuation.Accessor,
                Token.Type("UI"),
                Token.Punctuation.Accessor,
                Token.Type("Image"),
                Token.Punctuation.OpenBracket,
                Token.Punctuation.CloseBracket,
                Token.Identifiers.FieldName("selectedImages"),
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
                Token.Keywords.Modifiers.Private,
                Token.Keywords.Modifiers.ReadOnly,
                Token.Type("Dictionary"),
                Token.Punctuation.TypeParameters.Begin,
                Token.PrimitiveType.String,
                Token.Punctuation.Comma,
                Token.PrimitiveType.Int,
                Token.Punctuation.TypeParameters.End,
                Token.Identifiers.FieldName("languageToIndex"),
                Token.Operators.Assignment,
                Token.Keywords.New,
                Token.Type("Dictionary"),
                Token.Punctuation.TypeParameters.Begin,
                Token.PrimitiveType.String,
                Token.Punctuation.Comma,
                Token.PrimitiveType.Int,
                Token.Punctuation.TypeParameters.End,
                Token.Punctuation.OpenParen,
                Token.Punctuation.CloseParen,
                Token.Punctuation.OpenBrace,
                Token.Punctuation.OpenBrace,
                Token.Punctuation.String.Begin,
                Token.Literals.String("Simplified Chinese"),
                Token.Punctuation.String.End,
                Token.Punctuation.Comma,
                Token.Literals.Numeric.Decimal("0"),
                Token.Punctuation.CloseBrace,
                Token.Punctuation.Comma,
                Token.Punctuation.OpenBrace,
                Token.Punctuation.String.Begin,
                Token.Literals.String("English"),
                Token.Punctuation.String.End,
                Token.Punctuation.Comma,
                Token.Literals.Numeric.Decimal("1"),
                Token.Punctuation.CloseBrace,
                Token.Punctuation.Comma,
                Token.Punctuation.OpenBrace,
                Token.Punctuation.String.Begin,
                Token.Literals.String("Japanese"),
                Token.Punctuation.String.End,
                Token.Punctuation.Comma,
                Token.Literals.Numeric.Decimal("2"),
                Token.Punctuation.CloseBrace,
                Token.Punctuation.Comma,
                Token.Punctuation.OpenBrace,
                Token.Punctuation.String.Begin,
                Token.Literals.String("Korean"),
                Token.Punctuation.String.End,
                Token.Punctuation.Comma,
                Token.Literals.Numeric.Decimal("3"),
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
                Token.Keywords.Modifiers.Private,
                Token.Keywords.Modifiers.ReadOnly,
                Token.PrimitiveType.String,
                Token.Identifiers.FieldName("initSportMessageFormatString"),
                Token.Operators.Assignment,
                Token.Punctuation.String.Begin,
                Token.Literals.String("line1"),
                Token.Punctuation.String.End,
                Token.Operators.Arithmetic.Addition,
                Token.Punctuation.String.Begin,
                Token.Literals.String("line2"),
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
                Token.Keywords.Class,
                Token.Identifiers.ClassName("C"),
                Token.Punctuation.OpenBrace,
                Token.Type("List"),
                Token.Punctuation.TypeParameters.Begin,
                Token.Type("Action"),
                Token.Punctuation.TypeParameters.End,
                Token.Identifiers.FieldName("f"),
                Token.Operators.Assignment,
                Token.Keywords.New,
                Token.Type("List"),
                Token.Punctuation.TypeParameters.Begin,
                Token.Type("Action"),
                Token.Punctuation.TypeParameters.End,
                Token.Punctuation.OpenBrace,
                Token.Punctuation.OpenParen,
                Token.Punctuation.CloseParen,
                Token.Operators.Arrow,
                Token.Identifiers.MethodName("DoStuff"),
                Token.Punctuation.OpenParen,
                Token.Punctuation.CloseParen,
                Token.Punctuation.CloseBrace,
                Token.Punctuation.Semicolon,
                Token.Keywords.Modifiers.Public,
                Token.Identifiers.MethodName("C"),
                Token.Punctuation.OpenParen,
                Token.PrimitiveType.Int,
                Token.Identifiers.ParameterName("x"),
                Token.Punctuation.Comma,
                Token.PrimitiveType.Int,
                Token.Identifiers.ParameterName("y"),
                Token.Punctuation.CloseParen,
                Token.Punctuation.OpenBrace,
                Token.Punctuation.CloseBrace,
                Token.Punctuation.CloseBrace
            ]);
        });
    });
});