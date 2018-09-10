// SYNTAX TEST "Packages/User/ecmascript-sublime/ecmascript.sublime-syntax"
/* eslint-disable */

/* syntax: js */ `
class test_method_signatures {
   get ${method}() {}
// ^ storage.type.accessor.js storage.modifier.accessor.get.es
//     ^ punctuation.definition.string.interpolated.element.begin.es
//       ^ meta.interpolation.interpolated.es variable.other.readwrite.es

   set ${method}() {}
// ^ storage.type.accessor.js storage.modifier.accessor.set.es
//     ^ punctuation.definition.string.interpolated.element.begin.es
//       ^ meta.interpolation.interpolated.es variable.other.readwrite.es

   static ${method}() {}
// ^ storage.modifier.static.es storage.type.js
//   ^ entity.name.method.js entity.name.method.static.es
//        ^ punctuation.definition.string.interpolated.element.begin.es
//          ^ meta.interpolation.interpolated.es variable.other.readwrite.es

   * ${method}() {}
// ^ keyword.generator.asterisk.js storage.modifier.generator.asterisk.method.es
//        ^ punctuation.definition.string.interpolated.element.begin.es
//          ^ meta.interpolation.interpolated.es variable.other.readwrite.es

   async ${method}() {}
// ^ storage.modifier.async.method.es
//      ^ keyword.generator.asterisk.js storage.modifier.generator.asterisk.method.es
//        ^ punctuation.definition.string.interpolated.element.begin.es
//          ^ meta.interpolation.interpolated.es variable.other.readwrite.es

   async* ${method}() {}
// ^ storage.modifier.async.method.es
//      ^ keyword.generator.asterisk.js storage.modifier.generator.asterisk.method.es
//        ^ punctuation.definition.string.interpolated.element.begin.es
//          ^ meta.interpolation.interpolated.es variable.other.readwrite.es

   get pre_${method}() {}
// ^ storage.type.accessor.js storage.modifier.accessor.get.es
//     ^ entity.name.method.js entity.name.accessor.get.es
//         ^ punctuation.definition.string.interpolated.element.begin.es
//           ^ meta.interpolation.interpolated.es variable.other.readwrite.es

   set pre_${method}() {}
// ^ storage.type.accessor.js storage.modifier.accessor.set.es
//     ^ entity.name.method.js entity.name.accessor.set.es
//         ^ punctuation.definition.string.interpolated.element.begin.es
//           ^ meta.interpolation.interpolated.es variable.other.readwrite.es

   static pre_${method}() {}
// ^ storage.modifier.static.es storage.type.js
//   ^ entity.name.method.js entity.name.method.static.es
//        ^ entity.name.method.js entity.name.method.async.es
//            ^ punctuation.definition.string.interpolated.element.begin.es
//              ^ meta.interpolation.interpolated.es variable.other.readwrite.es

   * pre_${method}() {}
// ^ keyword.generator.asterisk.js storage.modifier.generator.asterisk.method.es
//        ^ entity.name.method.js entity.name.method.generator.es
//            ^ punctuation.definition.string.interpolated.element.begin.es
//              ^ meta.interpolation.interpolated.es variable.other.readwrite.es

   async pre_${method}() {}
// ^ storage.modifier.async.method.es
//      ^ keyword.generator.asterisk.js storage.modifier.generator.asterisk.method.es
//        ^ entity.name.method.js entity.name.method.async.es
//            ^ punctuation.definition.string.interpolated.element.begin.es
//              ^ meta.interpolation.interpolated.es variable.other.readwrite.es

   async* pre_${method}() {}
// ^ storage.modifier.async.method.es
//      ^ keyword.generator.asterisk.js storage.modifier.generator.asterisk.method.es
//        ^ entity.name.method.js entity.name.method.async.es
//            ^ punctuation.definition.string.interpolated.element.begin.es
//              ^ meta.interpolation.interpolated.es variable.other.readwrite.es

   get ${method}_post() {}
// ^ storage.type.accessor.js storage.modifier.accessor.get.es
//     ^ punctuation.definition.string.interpolated.element.begin.es
//       ^ meta.interpolation.interpolated.es variable.other.readwrite.es
//              ^ entity.name.method.js entity.name.accessor.get.es

   set ${method}_post() {}
// ^ storage.type.accessor.js storage.modifier.accessor.set.es
//     ^ punctuation.definition.string.interpolated.element.begin.es
//       ^ meta.interpolation.interpolated.es variable.other.readwrite.es
//              ^ entity.name.method.js entity.name.accessor.set.es

   static ${method}_post() {}
// ^ storage.modifier.static.es storage.type.js
//   ^ entity.name.method.js entity.name.method.static.es
//        ^ punctuation.definition.string.interpolated.element.begin.es
//          ^ meta.interpolation.interpolated.es variable.other.readwrite.es
//                 ^ entity.name.method.js entity.name.method.async.es

   * ${method}_post() {}
// ^ keyword.generator.asterisk.js storage.modifier.generator.asterisk.method.es
//        ^ punctuation.definition.string.interpolated.element.begin.es
//          ^ meta.interpolation.interpolated.es variable.other.readwrite.es
//                 ^ entity.name.method.js entity.name.method.generator.es

   async ${method}_post() {}
// ^ storage.modifier.async.method.es
//      ^ keyword.generator.asterisk.js storage.modifier.generator.asterisk.method.es
//        ^ punctuation.definition.string.interpolated.element.begin.es
//          ^ meta.interpolation.interpolated.es variable.other.readwrite.es
//                 ^ entity.name.method.js entity.name.method.async.es

   async* ${method}_post() {}
// ^ storage.modifier.async.method.es
//      ^ keyword.generator.asterisk.js storage.modifier.generator.asterisk.method.es
//        ^ punctuation.definition.string.interpolated.element.begin.es
//          ^ meta.interpolation.interpolated.es variable.other.readwrite.es
//                 ^ entity.name.method.js entity.name.method.async.es

   get pre_${method}_post() {}
// ^ storage.type.accessor.js storage.modifier.accessor.get.es
//     ^ entity.name.method.js entity.name.accessor.get.es
//         ^ punctuation.definition.string.interpolated.element.begin.es
//           ^ meta.interpolation.interpolated.es variable.other.readwrite.es
//                  ^ entity.name.method.js entity.name.accessor.get.es

   set pre_${method}_post() {}
// ^ storage.type.accessor.js storage.modifier.accessor.set.es
//     ^ entity.name.method.js entity.name.accessor.set.es
//         ^ punctuation.definition.string.interpolated.element.begin.es
//           ^ meta.interpolation.interpolated.es variable.other.readwrite.es
//                  ^ entity.name.method.js entity.name.accessor.set.es

   static pre_${method}_post() {}
// ^ storage.modifier.static.es storage.type.js
//   ^ entity.name.method.js entity.name.method.static.es
//        ^ entity.name.method.js entity.name.method.async.es
//            ^ punctuation.definition.string.interpolated.element.begin.es
//              ^ meta.interpolation.interpolated.es variable.other.readwrite.es
//                     ^ entity.name.method.js entity.name.method.async.es

   * pre_${method}_post() {}
// ^ keyword.generator.asterisk.js storage.modifier.generator.asterisk.method.es
//        ^ entity.name.method.js entity.name.method.generator.es
//            ^ punctuation.definition.string.interpolated.element.begin.es
//              ^ meta.interpolation.interpolated.es variable.other.readwrite.es
//                     ^ entity.name.method.js entity.name.method.generator.es

   async pre_${method}_post() {}
// ^ storage.modifier.async.method.es
//      ^ keyword.generator.asterisk.js storage.modifier.generator.asterisk.method.es
//        ^ entity.name.method.js entity.name.method.async.es
//            ^ punctuation.definition.string.interpolated.element.begin.es
//              ^ meta.interpolation.interpolated.es variable.other.readwrite.es
//                     ^ entity.name.method.js entity.name.method.async.es

   async* pre_${method}_post() {}
// ^ storage.modifier.async.method.es
//      ^ keyword.generator.asterisk.js storage.modifier.generator.asterisk.method.es
//        ^ entity.name.method.js entity.name.method.async.es
//            ^ punctuation.definition.string.interpolated.element.begin.es
//              ^ meta.interpolation.interpolated.es variable.other.readwrite.es
//                     ^ entity.name.method.js entity.name.method.async.es

   get pre_${method}_mid_${mod}_post() {}
// ^ storage.type.accessor.js storage.modifier.accessor.get.es
//     ^ entity.name.method.js entity.name.accessor.get.es
//         ^ punctuation.definition.string.interpolated.element.begin.es
//           ^ meta.interpolation.interpolated.es variable.other.readwrite.es
//                  ^ entity.name.method.js entity.name.accessor.get.es
//                       ^ punctuation.definition.string.interpolated.element.begin.es
//                         ^ meta.interpolation.interpolated.es variable.other.readwrite.es
//                             ^ entity.name.method.js entity.name.accessor.get.es

   set pre_${method}_mid_${mod}_post() {}
// ^ storage.type.accessor.js storage.modifier.accessor.set.es
//     ^ entity.name.method.js entity.name.accessor.set.es
//         ^ punctuation.definition.string.interpolated.element.begin.es
//           ^ meta.interpolation.interpolated.es variable.other.readwrite.es
//                  ^ entity.name.method.js entity.name.accessor.set.es
//                       ^ punctuation.definition.string.interpolated.element.begin.es
//                         ^ meta.interpolation.interpolated.es variable.other.readwrite.es
//                             ^ entity.name.method.js entity.name.accessor.set.es

   static pre_${method}_mid_${mod}_post() {}
// ^ storage.modifier.static.es storage.type.js
//   ^ entity.name.method.js entity.name.method.static.es
//        ^ entity.name.method.js entity.name.method.async.es
//            ^ punctuation.definition.string.interpolated.element.begin.es
//              ^ meta.interpolation.interpolated.es variable.other.readwrite.es
//                     ^ entity.name.method.js entity.name.method.async.es
//                          ^ punctuation.definition.string.interpolated.element.begin.es
//                            ^ meta.interpolation.interpolated.es variable.other.readwrite.es
//                                ^ entity.name.method.js entity.name.method.async.es

   * pre_${method}_mid_${mod}_post() {}
// ^ keyword.generator.asterisk.js storage.modifier.generator.asterisk.method.es
//        ^ entity.name.method.js entity.name.method.generator.es
//            ^ punctuation.definition.string.interpolated.element.begin.es
//              ^ meta.interpolation.interpolated.es variable.other.readwrite.es
//                     ^ entity.name.method.js entity.name.method.generator.es
//                          ^ punctuation.definition.string.interpolated.element.begin.es
//                            ^ meta.interpolation.interpolated.es variable.other.readwrite.es
//                                ^ entity.name.method.js entity.name.method.generator.es

   async pre_${method}_mid_${mod}_post() {}
// ^ storage.modifier.async.method.es
//      ^ keyword.generator.asterisk.js storage.modifier.generator.asterisk.method.es
//        ^ entity.name.method.js entity.name.method.async.es
//            ^ punctuation.definition.string.interpolated.element.begin.es
//              ^ meta.interpolation.interpolated.es variable.other.readwrite.es
//                     ^ entity.name.method.js entity.name.method.async.es
//                          ^ punctuation.definition.string.interpolated.element.begin.es
//                            ^ meta.interpolation.interpolated.es variable.other.readwrite.es
//                                ^ entity.name.method.js entity.name.method.async.es

   async* pre_${method}_mid_${mod}_post() {}
// ^ storage.modifier.async.method.es
//      ^ keyword.generator.asterisk.js storage.modifier.generator.asterisk.method.es
//        ^ entity.name.method.js entity.name.method.async.es
//            ^ punctuation.definition.string.interpolated.element.begin.es
//              ^ meta.interpolation.interpolated.es variable.other.readwrite.es
//                     ^ entity.name.method.js entity.name.method.async.es
//                          ^ punctuation.definition.string.interpolated.element.begin.es
//                            ^ meta.interpolation.interpolated.es variable.other.readwrite.es
//                                ^ entity.name.method.js entity.name.method.async.es

}
`;
