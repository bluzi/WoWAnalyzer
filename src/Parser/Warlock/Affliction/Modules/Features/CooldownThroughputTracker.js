import CoreCooldownThroughputTracker, { BUILT_IN_SUMMARY_TYPES } from 'Parser/Core/Modules/CooldownThroughputTracker';

import SPELLS from 'common/SPELLS';

const debug = false;

class CooldownThroughputTracker extends CoreCooldownThroughputTracker {
  static cooldownSpells = [
    ...CooldownThroughputTracker.cooldownSpells,
    {
      spell: SPELLS.SOUL_HARVEST_TALENT,
      summary: [
        BUILT_IN_SUMMARY_TYPES.DAMAGE,
      ],
    },
  ];

  //for the sake of completeness, typically none of these are used
  static castCooldowns = [
    {
      spell: SPELLS.SUMMON_INFERNAL_UNTALENTED,
      duration: 25,
      summary: [
        BUILT_IN_SUMMARY_TYPES.DAMAGE,
      ],
    },
    {
      spell: SPELLS.SUMMON_DOOMGUARD_UNTALENTED,
      duration: 25,
      summary: [
        BUILT_IN_SUMMARY_TYPES.DAMAGE,
      ],
    },
    {
      spell: SPELLS.GRIMOIRE_IMP,
      duration: 25,
      summary: [
        BUILT_IN_SUMMARY_TYPES.DAMAGE,
      ],
    },
    {
      spell: SPELLS.GRIMOIRE_VOIDWALKER,
      duration: 25,
      summary: [
        BUILT_IN_SUMMARY_TYPES.DAMAGE,
      ],
    },
    {
      spell: SPELLS.GRIMOIRE_SUCCUBUS,
      duration: 25,
      summary: [
        BUILT_IN_SUMMARY_TYPES.DAMAGE,
      ],
    },
    {
      spell: SPELLS.GRIMOIRE_FELHUNTER,
      duration: 25,
      summary: [
        BUILT_IN_SUMMARY_TYPES.DAMAGE,
      ],
    },
  ];

  on_byPlayer_cast(event) {
    const spellId = event.ability.guid;
    const cooldownSpell = this.constructor.castCooldowns.find(cooldownSpell => cooldownSpell.spell.id === spellId);
    if (cooldownSpell) {
      // adding the fixed cooldown, now we need to remove it from activeCooldowns too
      const cooldown = this._addFixedCooldown(cooldownSpell, event.timestamp);
      this.activeCooldowns.push(cooldown);
      debug && console.log(`%cCooldown started: ${cooldownSpell.spell.name}`, 'color: green', cooldown);
    }
    // super.on_byPlayer_cast(event) would call trackEvent anyway
    super.on_byPlayer_cast && super.on_byPlayer_cast(event);
  }

  _addFixedCooldown(cooldownSpell, timestamp) {
    const cooldown = {
      ...cooldownSpell,
      start: timestamp,
      end: timestamp + cooldownSpell.duration * 1000,
      events: [],
    };
    this.pastCooldowns.push(cooldown);
    return cooldown;
  }

  // on_event() might be more accurate but it would be most likely called much more
  trackEvent(event) {
    this.activeCooldowns = this.activeCooldowns.filter(cooldown => !cooldown.end || event.timestamp < cooldown.end);
    super.trackEvent(event);
  }

  on_byPlayerPet_damage(event) {
    this.trackEvent(event);
  }
}

export default CooldownThroughputTracker;
