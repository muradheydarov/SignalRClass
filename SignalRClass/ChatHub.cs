using Microsoft.AspNetCore.SignalR;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace SignalRClass
{
    public class ChatHub : Hub
    {
        public async Task SendMessage(string username, string message)
        {
            await Clients.All.SendAsync("ReceiveMessage", username, message);
        }

        // "P407", 1
        static List<Vote> votes = new List<Vote>();
        public async Task SendVote(string groupName)
        {
            var vote = votes.FirstOrDefault(x => x.Key == groupName);

            if (vote != null)
            {
                vote.Value++;
            }
            else
            {
                Vote vote1 = new Vote()
                {
                    Key = groupName,
                    Value = 1
                };

                votes.Add(vote1);
            }

            await Clients.All.SendAsync("ReceiveVote", votes);
        }

        public async Task CustomOnConnectedAsync(string username)
        {
            await Clients.All.SendAsync("UserConnected", username);            
        }

        //public override async Task OnConnectedAsync()
        //{
        //    await Clients.All.SendAsync("UserConnected", $"{Context.ConnectionId}");
        //    await base.OnConnectedAsync();
        //}

        public override async Task OnDisconnectedAsync(Exception exception)
        {
            await Clients.All.SendAsync("UserDisconnected", $"{Context.ConnectionId}");
            await base.OnDisconnectedAsync(exception);
        }
    }

    class Vote
    {
        public string Key { get; set; }
        public int Value { get; set; }
    }
}
