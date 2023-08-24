export type InterfaceMock<T extends { [key in string]: any}> = {
    [key in keyof T]: jest.Mock<ReturnType<T[key]>, Parameters<T[key]>>
}
