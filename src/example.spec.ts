class FriendsList {
    friends = [];

    addFriend(name) {
        this.friends.push(name);
        this.announceFriendship(name);
    }

    announceFriendship(name) {
        console.log(`${name} is now a friend.`);
    }

    removeFriend(name) {
        const idx = this.friends.indexOf(name);

        if(idx === -1) {
            throw new Error(`${name} not found.`);
        }

        this.friends.splice(idx, 1);
    }
}

//tests
describe('FriendsList', () => {
    let friendsList: FriendsList;

    beforeEach(() => {
        friendsList = new FriendsList();
    });

    it('initializes friends list', () => {
        expect(friendsList.friends.length).toEqual(0);
    });

    it('can add a friend', () => {
        friendsList.addFriend('John');
        expect(friendsList.friends.length).toEqual(1);
        expect(friendsList.friends[0]).toEqual('John');
    });

    it('can announce frienship', () => {
        friendsList.announceFriendship = jest.fn();
        expect(friendsList.announceFriendship).not.toBeCalled();
        friendsList.addFriend('John');
        expect(friendsList.announceFriendship).toBeCalled();
    });

    describe('Remove a friend', () => {
        it('can remove a friend', () => {
            friendsList.addFriend('John');
            expect(friendsList.friends[0]).toEqual('John');
            friendsList.removeFriend('John');
            expect(friendsList.friends[0]).toBeUndefined();
        });

        it('can throw exception if friend not found', () => {
            expect(() => friendsList.removeFriend('John')).toThrow(new Error('John not found.'));
        });
    })
});