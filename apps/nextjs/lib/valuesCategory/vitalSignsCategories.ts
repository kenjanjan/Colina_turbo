const bloodPressureRanges = [
    {
        type: 'normal',
        systolic: { min: 90, max: 120 },
        diastolic: { min: 60, max: 80 },
    },
    {
        type: 'urgent',
        systolic: [
            { min: 70, max: 89 },
            { min: 121, max: 139 },
        ],
        diastolic: [
            { min: 40, max: 59 },
            { min: 81, max: 89 },
        ],
    },
    {
        type: 'critical',
        systolic: [
            { min: 0, max: 69 },
            { min: 140, max: Infinity },
        ],
        diastolic: [
            { min: 0, max: 40 },
            { min: 90, max: Infinity },
        ],
    },
];



const heartRateRanges = [
    {
        type: 'normal',
        values: { min: 50, max: 110 },
    },
    {
        type: 'urgent',
        values: [
            { min: 41, max: 49 },
            { min: 111, max: 129 },
        ],
    },
    {
        type: 'critical',
        values: [
            { min: 0, max: 40 },
            { min: 130, max: Infinity },
        ],
    },
];

const respiratoryRateRanges = [
    {
        type: 'normal',
        values: { min: 12, max: 25 },
    },
    {
        type: 'urgent',
        values: [
            { min: 9, max: 11 },
            { min: 26, max: 29 },
        ],
    },
    {
        type: 'critical',
        values: [
            { min: 0, max: 8 },
            { min: 30, max: Infinity },
        ],
    },
];

const temperatureRanges = [
    {
        type: 'normal',
        values: { min: 96.62, max: 98.6 },
    },
    {
        type: 'urgent',
        values: [
            { min: 98.78, max: 101.3 },
            { min: 89.6, max: 96.44 },
        ],
    },
    {
        type: 'critical',
        values: [
            { min: 32, max: 87.8 },
            { min: 101.48, max: Infinity},
        ],
    },
];
//  count the values
export function getRowClassName(
    bloodPressure: string,
    heartRate: string,
    respiratoryRate: string,
    temperature: string
  ): string {
    // Get category classes
    const categories = [
      getBloodPressureCategoryClass(bloodPressure),
      getHeartRateCategoryClass(heartRate),
      getRespiratoryRateCategoryClass(respiratoryRate),
      getTemperatureCategoryClass(temperature)
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
function getBloodPressureCategory(systolic: number, diastolic: number): string {
    let systolicCategory = 'normal';
    let diastolicCategory = 'normal';

    for (const range of bloodPressureRanges) {
        let systolicMatch = false;
        let diastolicMatch = false;

        if (typeof range.systolic === 'object' && !Array.isArray(range.systolic)) {
            systolicMatch = range.systolic.min <= systolic && systolic <= range.systolic.max;
        } else if (Array.isArray(range.systolic)) {
            systolicMatch = range.systolic.some(r => r.min <= systolic && systolic <= r.max);
        }

        if (typeof range.diastolic === 'object' && !Array.isArray(range.diastolic)) {
            diastolicMatch = range.diastolic.min <= diastolic && diastolic <= range.diastolic.max;
        } else if (Array.isArray(range.diastolic)) {
            diastolicMatch = range.diastolic.some(r => r.min <= diastolic && diastolic <= r.max);
        }

        if (systolicMatch) {
            systolicCategory = range.type;
            console.log(systolicCategory, systolic, "systolic");
        }

        if (diastolicMatch) {
            diastolicCategory = range.type;
            console.log(diastolicCategory, diastolic, "diastolicCategory");
        }
    }

    let combinedCategory = 'normal';

    if (systolicCategory === 'critical' || diastolicCategory === 'critical') {
        combinedCategory = 'critical';
    } else if (systolicCategory === 'urgent' || diastolicCategory === 'urgent') {
        combinedCategory = 'urgent';
    }

    return combinedCategory;
}

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
function getHeartRateCategory(heartRate: number): string {
    return getCategory(heartRate, heartRateRanges);

}

function getTemperatureCategory(temperature: number): string {
    return getCategory(temperature, temperatureRanges);
}

function getRespiratoryRateCategory(respiratoryRate: number): string {
    return getCategory(respiratoryRate, respiratoryRateRanges);
}
export function getBloodPressureCategoryClass(bloodPressureString: string): string {
    const [systolic, diastolic] = bloodPressureString.split("/").map(Number);
    const category = getBloodPressureCategory(systolic, diastolic);
    
    switch (category) {
        case 'normal':
            return '';
        case 'urgent':
            return "text-[#FEBB00]";
        case 'critical':
            return 'text-[#DB3956]';
        default:
            return ''; // or any other default class
    }
 
}

export function getHeartRateCategoryClass(heartRateString: string): string {
    const heartRate = Number(heartRateString);
    const category = getHeartRateCategory(heartRate);
    switch (category) {
        case 'normal':
            return '';
        case 'urgent':
            return 'text-[#FEBB00]';
        case 'critical':
            return 'text-[#DB3956]';
        default:
            return ''; // or any other default class
    }
}
export function getTemperatureCategoryClass(temperatureString: string): string {
    const temperature = Number(temperatureString);
    const category = getTemperatureCategory(temperature);
    switch (category) {
        case 'normal':
            return '';
        case 'urgent':
            return 'text-[#FEBB00]';
        case 'critical':
            return 'text-[#DB3956]';
        default:
            return ''; // or any other default class
    }
}

export function getRespiratoryRateCategoryClass(respiratoryRateString: string): string {
    const respiratoryRate = Number(respiratoryRateString);
    const category = getRespiratoryRateCategory(respiratoryRate);
    switch (category) {
        case 'normal':
            return '';
        case 'urgent':
            return 'text-[#FEBB00]';
        case 'critical':
            return 'text-[#DB3956]';
        default:
            return ''; // or any other default class
    }
}
