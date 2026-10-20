# Lab 08 — Answers

**(a) Why can an interface not be an injection token?**
An interface exists only in TypeScript; the compiler removes it, so at runtime there is no value that Nest could use as a lookup key. A token must be a real runtime value such as a string, a Symbol or a class (an abstract class also works because it survives compilation). That is why `CourseStore` is an interface but `COURSE_STORE` is a Symbol.

**(b) What does it mean that a provider is a singleton?**
Nest creates one instance of a provider the first time it is needed and gives that same instance to every class that injects it. For example, the one `CoursesService` shares the same store, so a course created in one request is visible in the next. State kept in a provider therefore lives as long as the application runs.

**(c) What must you write so that OtherModule can use CoursesService?**
`CoursesModule` must list the service in `exports: [CoursesService]`, and `OtherModule` must list `CoursesModule` in its `imports: [...]`. Without the export the provider stays private to its module, and without the import `OtherModule` cannot see the exports.
