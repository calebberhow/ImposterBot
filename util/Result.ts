class Result<TValue>
{
    Value:TValue;
    Failed:boolean;

    constructor(failed: boolean, value: TValue)
    {
        this.Failed = failed;
        this.Value = value;
    }

    static Ok<T>(value:T): Result<T>
    {
        return new Result<T>(false, value);
    }

    static Failed(): Result<null>
    {
        return new Result<null>(true, null);
    }
}

export default Result;