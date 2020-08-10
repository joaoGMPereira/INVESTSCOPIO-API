
export class Logger {

    public static log(data: any, clazz?: String, method?: String, comment?: String) {
        console.log("\n··························································")
        if (clazz) {
            console.log("Class: " + clazz)
        }
        if (method) {
            console.log("Method: " + method)
        }
        if (comment) {
            console.log("Comment: " + comment)
        }
        console.log("data:")
        try {
            console.log(JSON.stringify(data))
        } catch (error) {
            console.log(data)
        }
        console.log("\n··························································\n")
    }
}