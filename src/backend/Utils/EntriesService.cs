using System;
using backend.Models;

namespace backend.Utils
{
    public class EntriesService
    {

        // TODO: impelement data seeding!
        private static List<EntryModel> _entries = new List<EntryModel>
        {
            new EntryModel{ UserName="user1", ProductName = "Apple", Calories = 10, ConsumedAt = new DateTime(2021,11,1,5,30,00)},
            new EntryModel{ UserName="user1", ProductName = "Apple", Calories = 10, ConsumedAt = new DateTime(2021,11,1,5,10,00)},
            new EntryModel{ UserName="user1", ProductName = "Apple", Calories = 10, ConsumedAt = new DateTime(2021,11,1,6,10,00)},
            new EntryModel{ UserName="user1", ProductName = "Apple", Calories = 10, ConsumedAt = new DateTime(2021,11,1,7,10,00)},
            new EntryModel{ UserName="user1", ProductName = "Orange", Calories = 11, ConsumedAt = new DateTime(2020,10,1,5,10,00)},
            new EntryModel{ UserName="user1", ProductName = "Orange", Calories = 11, ConsumedAt = new DateTime(2020,10,1,6,10,00)},
            new EntryModel{ UserName="user1", ProductName = "Orange", Calories = 11, ConsumedAt = new DateTime(2020,10,1,7,10,00)},
            new EntryModel{ UserName="user1", ProductName = "Orange", Calories = 11, ConsumedAt = new DateTime(2020,10,1,10,10,00)},
            new EntryModel{ UserName="user2", ProductName = "Orange", Calories = 11, ConsumedAt = new DateTime(2022,10,1,5,10,00)},
            new EntryModel{ UserName="user2", ProductName = "Orange", Calories = 11, ConsumedAt = new DateTime(2022,10,1,6,10,00)},
            new EntryModel{ UserName="user2", ProductName = "Orange", Calories = 11, ConsumedAt = new DateTime(2022,10,1,7,10,00)},
            new EntryModel{ UserName="user2", ProductName = "Orange", Calories = 11, ConsumedAt = new DateTime(2022,10,1,10,10,00)},
            new EntryModel{ UserName="user2", ProductName = "Apple", Calories = 10, ConsumedAt = new DateTime(2022,11,1,5,10,00)},
            new EntryModel{ UserName="user2", ProductName = "Apple", Calories = 10, ConsumedAt = new DateTime(2022,11,1,8,10,00)},
            new EntryModel{ UserName="user2", ProductName = "Apple", Calories = 10, ConsumedAt = new DateTime(2022,11,1,9,40,00)},
            new EntryModel{ UserName="user2", ProductName = "Apple", Calories = 10, ConsumedAt = new DateTime(2022,11,1,10,30,00)},
        };

        public static void SeedData()
        {
            for (int i = 1; i < 30; i++)
            {
                for (int j = 1; j < 5; j++)
                {
                    _entries.Add(new EntryModel
                    {
                        UserName = "user1",
                        ProductName = "Banana",
                        Calories = 110,
                        ConsumedAt = new DateTime(2020, 7, i, j*2, 30, 00)
                    });
                    _entries.Add(new EntryModel
                    {
                        UserName = "user2",
                        ProductName = "Banana",
                        Calories = 140,
                        ConsumedAt = new DateTime(2021, 7, i, j * 2, 30, 00)
                    });
                }
            }
        }

        public static IEnumerable<EntryModel> GetEntries(string userName)
        {
            return _entries.Where(p => p.UserName == userName)
                .OrderByDescending(p=>p.ConsumedAt);
        }

        public static void AddNewEntry(EntryModel model, string userName)
        {
            model.UserName = userName;
            _entries.Add(model);
        }
    }
}

