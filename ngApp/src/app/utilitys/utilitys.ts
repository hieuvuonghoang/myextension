export class Utilitys {

    static getCurrentDateStr(date: Date) {
        let result = "";
        try {
            result = date.toLocaleDateString("en-US", { year: 'numeric', month: 'numeric', day: 'numeric', hour: 'numeric', minute: 'numeric' });
        } catch (ex) {

        }
        return result;
    }

    static pagination(c: number, m: number) {
        let current = c,
            last = m,
            delta = 2,
            left = current - delta,
            right = current + delta + 1,
            range = [],
            rangeWithDots: string[] = [],
            l;

        for (let i = 1; i <= last; i++) {
            if (i == 1 || i == last || i >= left && i < right) {
                range.push(i);
            }
        }

        for (let i of range) {
            if (l) {
                if (i - l === 2) {
                    rangeWithDots.push(`${l + 1}`);
                } else if (i - l !== 1) {
                    rangeWithDots.push('...');
                }
            }
            rangeWithDots.push(`${i}`);
            l = i;
        }

        return rangeWithDots;
    }
}


