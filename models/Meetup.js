const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const MeetupSchema = new mongoose.Schema({
  title: { type: String, required: true },
  date: { type: Date, required: true },
  guests: [
    {
      user: {
        type: Schema.Types.ObjectId,
        ref: "users"
      },
      email: {
        type: String
      },
      avatar: {
        type: String
      }
    }
  ],
  likes: [
    {
      user: {
        type: Schema.Types.ObjectId,
        ref: "users"
      }
    }
  ],
  comments: [
    {
      user: {
        type: Schema.Types.ObjectId,
        ref: "users"
      },
      text: {
        type: String,
        required: true
      },
      name: {
        type: String
      },
      avatar: {
        type: String
      },
      date: {
        type: Date,
        default: Date.now
      }
    }
  ],
  createdAt: { type: Date, default: Date.now }
});

MeetupSchema.statics.likeById = function likeById(id, user) {
  return this.findByIdAndUpdate(id, {
    $push: {
      likes: {
        user: user
      }
    }
  });
};

MeetupSchema.statics.unlikeById = function unlikeById(id, user) {
  return this.findByIdAndUpdate(
    id,
    {
      $pull: {
        likes: {
          $in: user
        }
      }
    },
    { new: true }
  );
};

MeetupSchema.statics.addComment = function addComment(meetupId, comment) {
  return this.findByIdAndUpdate(
    meetupId,
    {
      $push: { comments: comment }
    },
    { new: true }
  );
};

MeetupSchema.statics.deleteCommentById = function deleteCommentById(
  meetupId,
  comment_id
) {
  let remove = {
    $pull: {
      comments: {_id: comment_id}
    }
  };

  return this.findByIdAndUpdate(meetupId, remove, { new: true });
};

MeetupSchema.statics.subscribe = function subscribe(meetupId, guest) {
  return this.findByIdAndUpdate(
    meetupId,
    {
      $push: { guests: {user: guest , email: guest.email, avatar: guest.avatar} }
    },
    { new: true }
  );
};

MeetupSchema.statics.deleteSubscription = function unsubscribe(
  meetupId,
  guest_id
) {
  let remove = {
    $pull: {
      guests: {user: guest_id}
    }
  };

  return this.findByIdAndUpdate(meetupId, remove, { new: true });
};


const Meetup = mongoose.model("Meetup", MeetupSchema, "meetups");

module.exports = Meetup;
