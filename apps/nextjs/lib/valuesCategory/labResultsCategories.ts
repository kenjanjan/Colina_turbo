const hemoglobinA1cRanges = [
    { type: 'normal', values: { min: 0, max: 5.69 } },
    { type: 'urgent', values: { min: 5.7, max: 6.4 } },
    { type: 'critical', values: { min: 6.5, max: Infinity } },
];

const bloodGlucoseRanges = [
    { type: 'normal', values: { min: 0, max: 99 } },
    { type: 'urgent', values: { min: 100, max: 125 } },
    { type: 'critical', values: { min: 126, max: Infinity } },
];

const totalCholesterolRanges = [
    { type: 'normal', values: { min: 0, max: 199 } },
    { type: 'urgent', values: { min: 200, max: 239 } },
    { type: 'critical', values: { min: 240, max: Infinity } },
];

const ldlCholesterolRanges = [
    { type: 'normal', values: { min: 0, max: 99 } },
    { type: 'urgent', values: { min: 100, max: 159 } },
    { type: 'critical', values: { min: 160, max: Infinity } },
];

const hdlCholesterolRanges = [
    { type: 'normal', values: { min: 60, max: Infinity } },
    { type: 'urgent', values: { min: 40, max: 59 } },
    { type: 'critical', values: { min: 0, max: 39 } },
];

const triglyceridesRanges = [
    { type: 'normal', values: { min: 0, max: 149 } },
    { type: 'urgent', values: { min: 150, max: 199 } },
    { type: 'critical', values: { min: 200, max: Infinity } },
];
function getCategory(value: number, ranges: any[]): string {
    for (const range of ranges) {
        let match = false;

        if (!Array.isArray(range.values)) {
            match = range.values.min <= value && value <= range.values.max;
        } else {
            match = range.values.some((r: any) => r.min <= value && value <= r.max);
        }

        if (match) {
            return range.type;
        }
    }

    return 'unknown'; // or any other default category
}

function getCategoryClass(category: string): string {
    switch (category) {
        case 'normal':
            return '';
        case 'urgent':
            return 'text-[#FEBB00]';
        case 'critical':
            return 'text-[#DB3956]';
        default:
            return '';
    }
}
export function getRowClassName(
    hemoglobinA1c: number,
    fastingBloodGlucose: number,
    totalCholesterol: number,
    ldlCholesterol: number,
    hdlCholesterol: number,
    triglycerides: number
): string {
    // Get category classes
    const categories = [
        getHemoglobinA1cCategoryClass(hemoglobinA1c),
        getBloodGlucoseCategoryClass(fastingBloodGlucose),
        getTotalCholesterolCategoryClass(totalCholesterol),
        getLdlCholesterolCategoryClass(ldlCholesterol),
        getHdlCholesterolCategoryClass(hdlCholesterol),
        getTriglyceridesCategoryClass(triglycerides),
    ];

    // Count the number of urgent or critical classes
    const urgentOrCriticalCount = categories.filter(className =>
        className.includes('text-[#FEBB00]') || className.includes('text-[#DB3956]')
    ).length;

    // Determine background color based on the count
    if (urgentOrCriticalCount >= 3) {
        return 'bg-[#FDF5F7]'; // 3 or more urgent/critical values
    } else if (urgentOrCriticalCount >= 2) {
        return 'bg-[#FFFDF7]'; // 2 urgent/critical values
    } else {
        return ''; // Default class
    }
}

function getCategoryClassByValue(value: number, ranges: any[]): string {
    const category = getCategory(value, ranges);
    return getCategoryClass(category);
}

export function getHemoglobinA1cCategoryClass(value: number): string {
    return getCategoryClassByValue(value, hemoglobinA1cRanges);
}

export function getBloodGlucoseCategoryClass(value: number): string {
    return getCategoryClassByValue(value, bloodGlucoseRanges);
}

export function getTotalCholesterolCategoryClass(value: number): string {
    return getCategoryClassByValue(value, totalCholesterolRanges);
}

export function getLdlCholesterolCategoryClass(value: number): string {
    return getCategoryClassByValue(value, ldlCholesterolRanges);
}

export function getHdlCholesterolCategoryClass(value: number): string {
    return getCategoryClassByValue(value, hdlCholesterolRanges);
}

export function getTriglyceridesCategoryClass(value: number): string {
    return getCategoryClassByValue(value, triglyceridesRanges);
}
