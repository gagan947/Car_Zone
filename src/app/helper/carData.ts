export const carData = {
      fuelTypes: [
            { title: 'Petrol', select: false, key: 'Petrol' },
            { title: 'Diesel', select: false, key: 'Diesel' },
            { title: 'Electric', select: false, key: 'Electric' },
            { title: 'Hybrid', select: false, key: 'Hybrid' },
            { title: 'CNG', select: false, key: 'CNG' },
            { title: 'LPG', select: false, key: 'LPG' },
      ],

      transmissions: [
            { title: 'Manual', select: false, key: 'Manual' },
            { title: 'Automatic', select: false, key: 'Automatic' },
            { title: 'CVT', select: false, key: 'CVT' },
            { title: 'Dual-Clutch', select: false, key: 'DualClutch' },
            { title: 'Single-Speed', select: false, key: 'SingleSpeed' },
      ],

      conditions: [
            {
                  title: 'New Car',
                  key: 'NewCar',
                  subTitle: 'Brand-new, never registered.',
                  select: false,
            },
            {
                  title: 'Demo Vehicle',
                  key: 'DemoVehicle',
                  subTitle: 'Dealer-owned demo or test car, low mileage.',
                  select: false,
            },
            {
                  title: 'Annual Car',
                  key: 'AnnualCar',
                  subTitle: 'Max. 12 months old, often company-internal use, very good condition',
                  select: false,
            },
            {
                  title: 'Used – Very Good Condition',
                  key: 'UsedVeryGood',
                  subTitle: 'Well-maintained, no damage, full service history.',
                  select: false,
            },
            {
                  title: 'Used – Good Condition',
                  key: 'UsedGood',
                  subTitle: 'Normal signs of use, technically sound.',
                  select: false,
            },
            {
                  title: 'Used – Roadworthy',
                  key: 'UsedRoadworthy',
                  subTitle: 'Drivable, but with visible defects or upcoming repairs.',
                  select: false,
            },
            {
                  title: 'Defective / No MFK',
                  key: 'DefectiveNoMFK',
                  subTitle: 'Not drivable or missing valid Swiss inspection (MFK).',
                  select: false,
            },
            {
                  title: 'Accident vehicle',
                  key: 'AccidentVehicle',
                  subTitle: 'Had an accident; may be repaired or still damaged.',
                  select: false,
            },
            {
                  title: 'Export vehicle',
                  key: 'ExportVehicle',
                  subTitle: 'Intended for export, no warranty, possibly with issues.',
                  select: false,
            },
      ],

      sittingCapacity: [2,4,5,6,7],

      sellerTypes: [
            { title: 'Private', key: 'personal' },
            { title: 'Official', key: 'business' },
      ],
}