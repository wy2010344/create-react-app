import { faker } from "@faker-js/faker"

export const fakeData1: {
  text: string
  color: string
}[] = [
    {
      text: "Lorem",
      color: "linear-gradient(135deg, #f6d365 0%, #fda085 100%)"
    },
    {
      text: "ipsum",
      color: "linear-gradient(135deg, #f6d365 0%, #fda085 100%)"
    },
    {
      text: "dolor",
      color: "linear-gradient(135deg, #5ee7df 0%, #b490ca 100%)"
    },
    {
      text: "sit",
      color: "linear-gradient(135deg, #c3cfe2 0%, #c3cfe2 100%)"
    }
  ]

export function generateRow(_: any, i: number) {
  return {
    text: faker.name.fullName() + i,
    color: `linear-gradient(135deg, ${faker.color.rgb().replace('0x', '#')} 0%, #c3cfe2 100%)`
  }
}
export const fakeData2 = Array(faker.datatype.number({
  min: 4,
  max: 10
})).fill(1).map(generateRow)