using System;
using backend.Models;

namespace backend.Utils
{
    public class EntriesService
    {

        // TODO: impelement data seeding!
        private static List<EntryModel> _entries = new List<EntryModel>
        {
            new EntryModel{ Id=1, UserName="user1", ProductName = "Apple", Calories = 10, ConsumedAt = new DateTime(2021,11,1,5,30,00)},
            new EntryModel{ Id=2,UserName="user1", ProductName = "Apple", Calories = 10, ConsumedAt = new DateTime(2021,11,1,5,10,00)},
            new EntryModel{ Id=3,UserName="user1", ProductName = "Apple", Calories = 10, ConsumedAt = new DateTime(2021,11,1,6,10,00)},
            new EntryModel{ Id=4,UserName="user1", ProductName = "Apple", Calories = 10, ConsumedAt = new DateTime(2021,11,1,7,10,00)},
            new EntryModel{ Id=5,UserName="user1", ProductName = "Orange", Calories = 11, ConsumedAt = new DateTime(2020,10,1,5,10,00)},
            new EntryModel{ Id=6,UserName="user1", ProductName = "Orange", Calories = 11, ConsumedAt = new DateTime(2020,10,1,6,10,00)},
            new EntryModel{ Id=7,UserName="user1", ProductName = "Orange", Calories = 11, ConsumedAt = new DateTime(2020,10,1,7,10,00)},
            new EntryModel{ Id=8,UserName="user1", ProductName = "Orange", Calories = 11, ConsumedAt = new DateTime(2020,10,1,10,10,00)},
            new EntryModel{ Id=9,UserName="user2", ProductName = "Orange", Calories = 11, ConsumedAt = new DateTime(2022,8,1,5,10,00)},
            new EntryModel{ Id=10,UserName="user2", ProductName = "Orange", Calories = 11, ConsumedAt = new DateTime(2022,8,1,6,10,00)},
            new EntryModel{ Id=11,UserName="user2", ProductName = "Orange", Calories = 11, ConsumedAt = new DateTime(2022,8,1,7,10,00)},
            new EntryModel{ Id=12,UserName="user2", ProductName = "Orange", Calories = 11, ConsumedAt = new DateTime(2022,8,1,10,10,00)},
            new EntryModel{ Id=13,UserName="user2", ProductName = "Apple", Calories = 10, ConsumedAt = new  DateTime(2022,8,1,5,10,00)},
            new EntryModel{ Id=14,UserName="user2", ProductName = "Apple", Calories = 10, ConsumedAt = new  DateTime(2022,8,1,8,10,00)},
            new EntryModel{ Id=15,UserName="user2", ProductName = "Apple", Calories = 10, ConsumedAt = new  DateTime(2022,8,1,9,40,00)},
            new EntryModel{ Id=16,UserName="user2", ProductName = "Apple", Calories = 10, ConsumedAt = new  DateTime(2022,8,1,10,30,00)},
        };

        public static void SeedData()
        {
            var k = _entries.Count;
            var today = DateTime.Now;
            for (int j = 1; j < 5; j++)
            {
                k++;
                _entries.Add(new EntryModel
                {
                    Id = k,
                    UserName = "user1",
                    ProductName = "Banana",
                    Calories = 110,
                    ConsumedAt = new DateTime(today.Year, today.Month, today.Day, j * 2, 30, 00)
                });
                k++;
                _entries.Add(new EntryModel
                {
                    Id = k,
                    UserName = "user2",
                    ProductName = "Banana",
                    Calories = 140,
                    ConsumedAt = new DateTime(today.Year, today.Month, today.Day, j * 2, 30, 00)
                });
            }
        }

        public static IEnumerable<EntryModel> GetEntries(string userName)
        {
            return _entries.Where(p => p.UserName == userName)
                .OrderByDescending(p=>p.ConsumedAt);
        }

        public static EntryModel AddNewEntry(EntryModel model, string userName)
        {
            model.UserName = userName;
            model.Id = _entries.Count + 1;
            _entries.Add(model);
            return model;
        }

        public static EntryModel? RemoveEntry(int id)
        {
            var entry = _entries.Find(p =>p.Id == id);
            if (entry != null)
            {
                _entries.Remove(entry);
            }
            return entry;
        }

        public static EntryModel? UpdateEntry(int id, EntryModel model)
        {
            var entry = _entries.Find(p => p.Id == id);
            if (entry != null)
            {
                entry.ProductName = model.ProductName;
                entry.Calories = model.Calories;
            }
            return entry;
        }
    }
}

