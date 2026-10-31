/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

import { expect } from 'chai';
import { tokenize, Token } from './utils/tokenize';

const type = (text: string): Token => ({ text, type: 'entity.name.type.cs' });
const variable = (text: string): Token => ({ text, type: 'variable.other.readwrite.cs' });

describe('Markdown hover declarations', () => {
    it('classifies the method receiver but leaves earlier qualifiers unclassified', async () => {
        expect(await tokenize('\u200BSystem.String My.Namespace.Widget.Create(System.Uri address)')).to.deep.equal([
            Token.Punctuation.Accessor,
            type('String'),
            Token.Punctuation.Accessor,
            Token.Punctuation.Accessor,
            type('Widget'),
            Token.Punctuation.Accessor,
            Token.Identifier.MethodName('Create'),
            Token.Punctuation.OpenParen,
            Token.Punctuation.Accessor,
            type('Uri'),
            Token.Identifier.ParameterName('address'),
            Token.Punctuation.CloseParen
        ]);
    });

    const cases: { name: string; declaration: string; names: Token[] }[] = [
        {
            name: 'namespaces',
            declaration: 'namespace System.Collections.Generic',
            names: ['System', 'Collections', 'Generic'].map(Token.Identifier.NamespaceName)
        },
        {
            name: 'generic types with variance',
            declaration: 'interface System.Collections.Generic.IEnumerable<out T>',
            names: [type('IEnumerable'), type('T')]
        },
        {
            name: 'nested generic type qualifiers',
            declaration: 'class N.Outer<T>.Inner<U>',
            names: [type('T'), type('Inner'), type('U')]
        },
        {
            name: 'records and primary constructors',
            declaration: 'record struct N.Point(int X, int Y)',
            names: [type('Point'), Token.Identifier.ParameterName('X'), Token.Identifier.ParameterName('Y')]
        },
        {
            name: 'enum underlying types',
            declaration: 'enum N.Options : byte',
            names: [type('Options')]
        },
        {
            name: 'constructors',
            declaration: 'N.Widget.Widget(int size)',
            names: [type('Widget'), Token.Identifier.ParameterName('size')]
        },
        {
            name: 'generic constructors',
            declaration: 'N.Widget<T>.Widget(T value)',
            names: [type('T'), type('Widget'), type('T'), Token.Identifier.ParameterName('value')]
        },
        {
            name: 'methods with nested generics',
            declaration: 'N.Result<T> N.Widget<T>.Map<U>(N.Input<U> value)',
            names: [type('Result'), type('T'), type('Widget'), type('T'), Token.Identifier.MethodName('Map'), type('U'),
                type('Input'), type('U'), Token.Identifier.ParameterName('value')]
        },
        {
            name: 'localized annotations',
            declaration: '(variable locale) N.Value value',
            names: [type('Value'), variable('value')]
        },
        {
            name: 'combined annotations and overload counts',
            declaration: '(awaitable, extension) Task N.Extensions.Load(int count) (+ 2 overloads)',
            names: [type('Task'), type('Extensions'), Token.Identifier.MethodName('Load'), Token.Identifier.ParameterName('count')]
        },
        {
            name: 'localized combined annotations with nested return types',
            declaration: '(attendable, extension) Task<(N.Widget item, int count)> N.Extensions.Load()',
            names: [type('Task'), type('Widget'), Token.Identifier.TupleElementName('item'),
                Token.Identifier.TupleElementName('count'), type('Extensions'), Token.Identifier.MethodName('Load')]
        },
        {
            name: 'annotated tuple returns',
            declaration: '(extension) (N.Widget item, int count) N.Extensions.Load()',
            names: [type('Widget'), Token.Identifier.TupleElementName('item'),
                Token.Identifier.TupleElementName('count'), type('Extensions'), Token.Identifier.MethodName('Load')]
        },
        {
            name: 'fields',
            declaration: '(field) static readonly System.DateTime System.DateTime.MaxValue',
            names: [type('DateTime'), variable('MaxValue')]
        },
        {
            name: 'constants and enum members',
            declaration: 'N.Color.Red = 1',
            names: [variable('Red')]
        },
        {
            name: 'locals',
            declaration: '(local variable) N.Widget value',
            names: [type('Widget'), variable('value')]
        },
        {
            name: 'parameter hovers',
            declaration: '(parameter) ref readonly N.Widget value',
            names: [type('Widget'), variable('value')]
        },
        {
            name: 'range variables and unknown types',
            declaration: '(range variable) ? value',
            names: [variable('value')]
        },
        {
            name: 'labels',
            declaration: '(label) target',
            names: [variable('target')]
        },
        {
            name: 'properties',
            declaration: 'N.Widget N.Container.Value { get; private set; }',
            names: [type('Widget'), Token.Identifier.PropertyName('Value')]
        },
        {
            name: 'indexers',
            declaration: 'ref readonly N.Widget N.Container.this[int index] { get; }',
            names: [type('Widget'), Token.Identifier.PropertyName('this'), Token.Identifier.ParameterName('index')]
        },
        {
            name: 'events',
            declaration: 'event System.EventHandler N.Widget.Changed',
            names: [type('EventHandler'), Token.Identifier.EventName('Changed')]
        },
        {
            name: 'Roslyn events without an event keyword',
            declaration: 'System.Action C.E',
            names: [type('Action'), variable('E')]
        },
        {
            name: 'delegates',
            declaration: 'delegate N.Result N.Converter(N.Input value)',
            names: [type('Result'), type('Converter'), type('Input'), Token.Identifier.ParameterName('value')]
        },
        {
            name: 'operators',
            declaration: 'N.Widget N.Widget.operator checked +(N.Widget left, N.Widget right)',
            names: [type('Widget'), Token.Identifier.MethodName('+'), type('Widget'),
                Token.Identifier.ParameterName('left'), type('Widget'), Token.Identifier.ParameterName('right')]
        },
        {
            name: 'conversion operators',
            declaration: 'N.Widget.implicit operator int(N.Widget value)',
            names: [type('Widget'), Token.Identifier.ParameterName('value')]
        },
        {
            name: 'checked conversion operators',
            declaration: 'N.Widget.explicit operator checked N.Other(N.Widget value)',
            names: [type('Other'), type('Widget'), Token.Identifier.ParameterName('value')]
        },
        {
            name: 'extension block members',
            declaration: 'void Extensions.extension(string).Goo(int value)',
            names: [Token.Identifier.MethodName('Goo'), Token.Identifier.ParameterName('value')]
        },
        {
            name: 'anonymous delegates',
            declaration: 'delegate string <anonymous delegate>(ref object? arg)?',
            names: [Token.Identifier.ParameterName('arg')]
        },
        {
            name: 'optional parameters',
            declaration: 'void N.Widget.M([int count = 42], [string text = "hello"])',
            names: [type('Widget'), Token.Identifier.MethodName('M'), Token.Identifier.ParameterName('count'), Token.Identifier.ParameterName('text')]
        },
        {
            name: 'function pointers',
            declaration: 'void N.Widget.M(delegate* unmanaged[Cdecl]<int, void> callback)',
            names: [type('Widget'), Token.Identifier.MethodName('M'), type('Cdecl'), Token.Identifier.ParameterName('callback')]
        },
        {
            name: 'tuple returns and named tuple elements',
            declaration: '(N.Widget item, int count) N.Widget.M((string text, N.Widget item) value)',
            names: [type('Widget'), Token.Identifier.TupleElementName('item'), Token.Identifier.TupleElementName('count'),
                type('Widget'), Token.Identifier.MethodName('M'), Token.Identifier.TupleElementName('text'), type('Widget'),
                Token.Identifier.TupleElementName('item'), Token.Identifier.ParameterName('value')]
        },
        {
            name: 'unnamed tuple elements',
            declaration: '(N.Widget, N.Other) N.Widget.M()',
            names: [type('Widget'), type('Other'), type('Widget'), Token.Identifier.MethodName('M')]
        },
        {
            name: 'nullable arrays and pointer types',
            declaration: 'N.Widget?[] N.Widget.M(int* pointer, N.Other[,] values)',
            names: [type('Widget'), type('Widget'), Token.Identifier.MethodName('M'), Token.Identifier.ParameterName('pointer'),
                type('Other'), Token.Identifier.ParameterName('values')]
        },
        {
            name: 'multiline constraints',
            declaration: 'class N.Widget<T>\n    where T : N.IWidget, new()',
            names: [type('Widget'), type('T'), type('T'), type('IWidget')]
        },
        {
            name: 'multiline parameter lists',
            declaration: 'N.Widget N.Factory.Create(\n    N.Input value,\n    int count)',
            names: [type('Widget'), type('Factory'), Token.Identifier.MethodName('Create'), type('Input'),
                Token.Identifier.ParameterName('value'), Token.Identifier.ParameterName('count')]
        },
        {
            name: 'alias-qualified types',
            declaration: 'global::N.Widget N.Widget.M(alias::N.Input value)',
            names: [type('Widget'), type('Widget'), Token.Identifier.MethodName('M'), type('Input'), Token.Identifier.ParameterName('value')]
        },
        {
            name: 'escaped identifiers',
            declaration: 'N.@class N.Widget.@event(N.@struct @params)',
            names: [type('@class'), type('Widget'), Token.Identifier.MethodName('@event'), type('@struct'),
                Token.Identifier.ParameterName('@params')]
        }
    ];

    for (const { name, declaration, names } of cases) {
        it(`classifies ${name}`, async () => {
            const tokens = await tokenize('\u200B' + declaration);
            expect(tokens.filter(token => token.type.startsWith('entity.name.') ||
                token.type === 'variable.other.readwrite.cs')).to.deep.equal(names);
        });
    }

    it('does not enable the hover context for ordinary source', async () => {
        const tokens = await tokenize('class C { }');
        expect(tokens).to.deep.equal([
            Token.Keyword.Definition.Class,
            Token.Identifier.ClassName('C'),
            Token.Punctuation.OpenBrace,
            Token.Punctuation.CloseBrace
        ]);
    });

    it('preserves standalone built-in types', async () => {
        expect(await tokenize('\u200Bdynamic')).to.deep.equal([Token.PrimitiveType.Dynamic]);
    });

    it('does not interpret the global namespace placeholder as a declaration', async () => {
        expect(await tokenize('\u200B<global namespace>')).to.deep.equal([]);
    });

    it('requires the marker at the beginning of a fresh block', async () => {
        const tokens = await tokenize('\n\u200Bclass C { }');
        expect(tokens).to.include.deep.members([Token.Identifier.ClassName('C')]);
        expect(tokens).not.to.include.deep.members([type('C')]);
    });
});
